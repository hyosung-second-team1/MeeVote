package today.meevote.domain.voting_schedule.service;

import lombok.RequiredArgsConstructor;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import today.meevote.contextholder.MemberContextHolder;
import today.meevote.domain.notify.dao.NotifyDao;
import today.meevote.domain.voting_schedule.dao.VotingScheduleDao;
import today.meevote.domain.voting_schedule.dto.request.CreatePlaceDto;
import today.meevote.domain.voting_schedule.dto.response.*;
import today.meevote.exception.rest.RestException;
import today.meevote.response.FailureInfo;

import java.sql.SQLException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VotingScheduleService {

    private final VotingScheduleDao votingScheduleDao;
    private final NotifyDao notifyDao;

    public List<GetVotingScheduleListDto> getVotingScheduleList() {
        String email = MemberContextHolder.getEmail();
        return votingScheduleDao.getVotingScheduleList(email);
    }

    public GetVotingScheduleDetailDto getVotingScheduleDetail(long scheduleId) {
        String email = MemberContextHolder.getEmail();

        VotingScheduleInfoDto votingScheduleInfoDto = votingScheduleDao.getVotingScheduleInfo(scheduleId)
                        .orElseThrow(() -> new RestException(FailureInfo.NOT_EXIST_VOTING_SCHEDULE));

        if(!votingScheduleDao.isExistMemberSchedule(email, scheduleId))
            throw new RestException(FailureInfo.NOT_EXIST_MEMBER_SCHEDULE);

        List<PlaceToVoteDto> placeToVoteList = votingScheduleDao.getPlaceToVoteList(scheduleId, email);

        List<VotingScheduleMemberDto> memberList = votingScheduleDao.getVotingScheduleMemberList(scheduleId);

        boolean isRequesterOwner = votingScheduleDao.isScheduleOwner(email, scheduleId);

        return GetVotingScheduleDetailDto.builder()
                .votingScheduleInfo(votingScheduleInfoDto)
                .placeToVoteList(placeToVoteList)
                .memberList(memberList)
                .isRequesterOwner(isRequesterOwner)
                .build();
    }

    public void addPlaceToVote(long scheduleId, CreatePlaceDto addPlaceToVoteDto) {
        String email = MemberContextHolder.getEmail();

        if(!votingScheduleDao.isExistVotingSchedule(scheduleId))
            throw new RestException(FailureInfo.NOT_EXIST_VOTING_SCHEDULE);

        if(!votingScheduleDao.isExistMemberSchedule(email, scheduleId))
            throw new RestException(FailureInfo.NOT_EXIST_MEMBER_SCHEDULE);

        // SQLException - 동시성 제어 / 유니크 키 제약 조건 위반 처리
        try {
            votingScheduleDao.addPlaceToVote(scheduleId, addPlaceToVoteDto);
        } catch (DuplicateKeyException e) {
            // ORA-00001: unique 키 위배
            throw new RestException(FailureInfo.ALREADY_EXIST_PLACE_TO_VOTE);
        }
    }

    public void toggleVotePlace(long placeToVoteId) {
        String email = MemberContextHolder.getEmail();

        Long scheduleId = votingScheduleDao.getScheduleIdByPlaceToVoteId(placeToVoteId)
                .orElseThrow(() -> new RestException(FailureInfo.NOT_EXIST_PLACE_TO_VOTE));

        if(!votingScheduleDao.isExistVotingSchedule(scheduleId))
            throw new RestException(FailureInfo.NOT_EXIST_VOTING_SCHEDULE);

        if(!votingScheduleDao.isExistMemberSchedule(email, scheduleId))
            throw new RestException(FailureInfo.NOT_EXIST_MEMBER_SCHEDULE);

        if(votingScheduleDao.isExistPlaceVoted(email, placeToVoteId))
            votingScheduleDao.deletePlaceVoted(email, placeToVoteId);
        else
            votingScheduleDao.createPlaceVoted(email, placeToVoteId);

    }

    public void updateDeparturePlace(long scheduleId, CreatePlaceDto updateDeparturePlaceDto) {
        String email = MemberContextHolder.getEmail();

        if(!votingScheduleDao.isExistVotingSchedule(scheduleId))
            throw new RestException(FailureInfo.NOT_EXIST_VOTING_SCHEDULE);

        if(!votingScheduleDao.isExistMemberSchedule(email, scheduleId))
            throw new RestException(FailureInfo.NOT_EXIST_MEMBER_SCHEDULE);

        if(votingScheduleDao.isExistDeparturePlace(email, scheduleId))
            votingScheduleDao.updateDeparturePlace(email, scheduleId, updateDeparturePlaceDto);
        else
            votingScheduleDao.createDeparturePlace(email, scheduleId, updateDeparturePlaceDto);


    }

    public void deleteDeparturePlace(long scheduleId) {
        String email = MemberContextHolder.getEmail();

        if(!votingScheduleDao.isExistVotingSchedule(scheduleId))
            throw new RestException(FailureInfo.NOT_EXIST_VOTING_SCHEDULE);

        if(!votingScheduleDao.isExistMemberSchedule(email, scheduleId))
            throw new RestException(FailureInfo.NOT_EXIST_MEMBER_SCHEDULE);

        votingScheduleDao.deleteDeparturePlace(email, scheduleId);
    }

    @Transactional
    public void confirmPlace(long placeToVoteId) {
        String email = MemberContextHolder.getEmail();

        Long scheduleId = votingScheduleDao.getScheduleIdByPlaceToVoteId(placeToVoteId)
                .orElseThrow(() -> new RestException(FailureInfo.NOT_EXIST_PLACE_TO_VOTE));

        if(!votingScheduleDao.isExistVotingSchedule(scheduleId))
            throw new RestException(FailureInfo.NOT_EXIST_VOTING_SCHEDULE);

        if(!votingScheduleDao.isScheduleOwner(email, scheduleId))
            throw new RestException(FailureInfo.NOT_SCHEDULE_OWNER);

        votingScheduleDao.confirmPlace(placeToVoteId);

        notifyDao.createAllConfirmNotify(scheduleId);
    }
}
