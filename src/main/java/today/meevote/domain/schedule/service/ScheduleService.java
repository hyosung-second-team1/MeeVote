package today.meevote.domain.schedule.service;

import java.util.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.util.StringUtils;
import today.meevote.contextholder.MemberContextHolder;
import today.meevote.domain.schedule.dao.ScheduleDao;
import today.meevote.domain.schedule.dto.request.CreateGroupScheduleDto;
import today.meevote.domain.schedule.dto.request.CreatePersonalScheduleDto;
import today.meevote.domain.schedule.dto.request.InviteMemberDto;
import today.meevote.domain.schedule.dto.response.*;
import today.meevote.domain.voting_schedule.dto.response.VotingScheduleInfoDto;
import today.meevote.exception.rest.RestException;
import today.meevote.response.BaseResponse;
import today.meevote.response.FailureInfo;
import today.meevote.utils.DateUtil;

@Service
@RequiredArgsConstructor
public class ScheduleService {

	private final ScheduleDao scheduleDao;

	@Transactional
	public void createPersonalSchedule(CreatePersonalScheduleDto dto) {
		String email = MemberContextHolder.getEmail();
        if (!scheduleDao.isExistByEmail(email)) {
            throw new RestException(FailureInfo.NOT_EXIST_MEMBER);
        }
        if (!scheduleDao.isCategoryExist(dto.getScheduleCategoryId())) {
            throw new RestException(FailureInfo.NOT_EXIST_CATEGORY);
        }

        DateUtil.validateDateOrder(dto.getStartDate(), dto.getEndDate());
        Map<String, Object> params = new HashMap<>();
        params.put("dto", dto);
        scheduleDao.createPersonalSchedule(params);
        Long scheduleId = (Long) params.get("id");
        scheduleDao.createMemberSchedule(email, scheduleId);

        if (StringUtils.hasText(dto.getPlaceName())
                && StringUtils.hasText(dto.getPlaceLatitude())
                && StringUtils.hasText(dto.getPlaceLongitude())) {
            scheduleDao.createSchedulePlace(params);
        }
	}

	@Transactional
	public void deletePersonalSchedule(long scheduleId) {
		String email = MemberContextHolder.getEmail();
        if (!scheduleDao.isExistScheduleByInfo(email, scheduleId)) {
            throw new RestException(FailureInfo.NOT_EXIST_DELETE_SCHEDULE);
        }
        scheduleDao.deletePersonalSchedule(email, scheduleId);
	}

    public List<GetMyScheduleListDto> getMyScheduleList(Boolean isGroup, String year, String month) {
        String email = MemberContextHolder.getEmail();
        return scheduleDao.getMyScheduleList(email, isGroup, year, month);
    }

    public List<GetScheduleCategoryDto> getCategory() {
        return scheduleDao.getCategory();
    }

    @Transactional
    public long createGroupSchedule(CreateGroupScheduleDto createGroupScheduleDto) {
        String email = MemberContextHolder.getEmail();

        // 세션의 email 제거
        Set<String> emailSet = new HashSet<>(createGroupScheduleDto.getInviteEmailList());
        emailSet.remove(email);
        createGroupScheduleDto.setInviteEmailList(new ArrayList<>(emailSet));

        if (scheduleDao.isExistGroupMember(createGroupScheduleDto.getInviteEmailList()) != createGroupScheduleDto.getInviteEmailList().size()
                || !scheduleDao.isExistByEmail(email)
        ) throw new RestException(FailureInfo.NOT_EXIST_MEMBER);

        if (!scheduleDao.isCategoryExist(createGroupScheduleDto.getScheduleCategoryId()))
            throw new RestException(FailureInfo.NOT_EXIST_CATEGORY);

        DateUtil.validateDateOrder(
                createGroupScheduleDto.getStartDate(),
                createGroupScheduleDto.getEndDate(),
                createGroupScheduleDto.getVoteDeadline());

        Map<String, Object> params = new HashMap<>();
        params.put("dto", createGroupScheduleDto);
        params.put("ownerEmail", email);
        scheduleDao.createGroupSchedule(params);
        scheduleDao.createGroupMemberSchedule(params);
        return (long) params.get("id");
    }

    public GetScheduleDetailDto getScheduleDetail(long scheduleId) {
        String email = MemberContextHolder.getEmail();
        ScheduleDetailInfoDto scheduleDetailInfoDto = scheduleDao.getScheduleDetailInfoDto(email, scheduleId)
                .orElseThrow(() -> new RestException(FailureInfo.NOT_EXIST_SCHEDULE));

        List<ScheduleMemberDto> memberList = scheduleDao.getScheduleMemberDtoList(scheduleId);

        return GetScheduleDetailDto.builder()
                .scheduleDetailInfo(scheduleDetailInfoDto)
                .memberList(memberList)
                .build();
    }

    public List<GetScheduleListDto> getFutureScheduleList() {
        String email = MemberContextHolder.getEmail();
        return scheduleDao.getFutureScheduleList(email);
    }

    public void outGroupSchedule(long scheduleId) {
        String email = MemberContextHolder.getEmail();
        if(!scheduleDao.isExistGroupMemberByInfo(email, scheduleId))
            throw new RestException(FailureInfo.NOT_OUT_MEMBER_SCHEDULE);
        scheduleDao.outGroupSchedule(email, scheduleId);
    }

    public Page<GetScheduleListDto> getPastScheduleList(long categoryId, String keyword, Pageable pageable) {
        String email = MemberContextHolder.getEmail();
        if (!scheduleDao.isCategoryExist(categoryId)) {
            throw new RestException(FailureInfo.NOT_EXIST_CATEGORY);
        }
        List<GetScheduleListDto> schedules = scheduleDao.getPastScheduleList(email, categoryId, keyword, pageable);
        int total = scheduleDao.countPastScheduleList(categoryId, keyword);
        return new PageImpl<>(schedules, pageable, total);
    }

    public void inviteMember(InviteMemberDto inviteMemberDto) {
        String email = MemberContextHolder.getEmail();

        Set<String> emailSet = new HashSet<>(inviteMemberDto.getInviteEmailList());
        emailSet.remove(email);
        inviteMemberDto.setInviteEmailList(new ArrayList<>(emailSet));
        List<String> registeredEmails = scheduleDao.findRegisteredEmails(emailSet);
        List<String> existingEmails = scheduleDao.findExistingMembers(inviteMemberDto.getScheduleId(), emailSet);

        if (!scheduleDao.isOwner(email, inviteMemberDto.getScheduleId()))
            throw new RestException(FailureInfo.NOT_SCHEDULE_OWNER);

        if (registeredEmails.size() != emailSet.size()) {
            throw new RestException(FailureInfo.NOT_EXIST_MEMBER);
        }

        if (!existingEmails.isEmpty())
            throw new RestException(FailureInfo.ALREADY_EXIST_MEMBER);
        scheduleDao.inviteMember(inviteMemberDto.getScheduleId(), inviteMemberDto);
    }
}
