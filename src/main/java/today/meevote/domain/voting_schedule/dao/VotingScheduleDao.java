package today.meevote.domain.voting_schedule.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import today.meevote.domain.voting_schedule.dto.request.CreatePlaceDto;
import today.meevote.domain.voting_schedule.dto.response.GetVotingScheduleListDto;
import today.meevote.domain.voting_schedule.dto.response.PlaceToVoteDto;
import today.meevote.domain.voting_schedule.dto.response.VotingScheduleInfoDto;
import today.meevote.domain.voting_schedule.dto.response.VotingScheduleMemberDto;

import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@Mapper
public interface VotingScheduleDao {

    public List<GetVotingScheduleListDto> getVotingScheduleList(String email);

    public Optional<VotingScheduleInfoDto> getVotingScheduleInfo(long scheduleId);

    public boolean isExistMemberSchedule(@Param("email") String email, @Param("scheduleId") long scheduleId);
    public boolean isScheduleOwner(@Param("email") String email, @Param("scheduleId") long scheduleId);

    public List<PlaceToVoteDto> getPlaceToVoteList(@Param("scheduleId") long scheduleId, @Param("email") String email);

    public List<VotingScheduleMemberDto> getVotingScheduleMemberList(long scheduleId);

    public boolean isExistVotingSchedule(long scheduleId);

    public boolean isDuplicatePlaceToVote(@Param("scheduleId") long scheduleId, @Param("dto") CreatePlaceDto addPlaceToVoteDto);

    public void addPlaceToVote(@Param("scheduleId") long scheduleId, @Param("dto") CreatePlaceDto addPlaceToVoteDto); // throws SQLException;

    public boolean isExistPlaceToVote(long placeToVoteId);

    public boolean isExistPlaceVoted(@Param("email") String email, @Param("placeToVoteId") long placeToVoteId);

    public void deletePlaceVoted(@Param("email") String email, @Param("placeToVoteId") long placeToVoteId);

    public void createPlaceVoted(@Param("email") String email, @Param("placeToVoteId") long placeToVoteId);

    public Optional<Long> getScheduleIdByPlaceToVoteId(long placeToVoteId);

    public boolean isExistDeparturePlace(@Param("email") String email, @Param("scheduleId") long scheduleId);

    public void createDeparturePlace(@Param("email") String email, @Param("scheduleId") long scheduleId, @Param("dto") CreatePlaceDto updateDeparturePlaceDto);

    public void updateDeparturePlace(@Param("email") String email, @Param("scheduleId") long scheduleId, @Param("dto") CreatePlaceDto updateDeparturePlaceDto);

    public void deleteDeparturePlace(@Param("email") String email, @Param("scheduleId") long scheduleId);

    public void confirmPlace(long placeToVoteId);
}
