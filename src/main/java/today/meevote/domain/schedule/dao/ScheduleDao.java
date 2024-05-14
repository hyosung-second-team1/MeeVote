package today.meevote.domain.schedule.dao;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import org.springframework.data.domain.Pageable;
import today.meevote.domain.schedule.dto.request.CreateGroupScheduleDto;
import today.meevote.domain.schedule.dto.request.InviteMemberDto;
import today.meevote.domain.schedule.dto.response.*;

@Mapper
public interface ScheduleDao {
	
	public boolean isExistByEmail(String email);
	
	public boolean isCategoryExist(long categoryId);
	
    public void createPersonalSchedule(Map<String, Object> dto);
    
    public void createMemberSchedule(@Param("email") String email, @Param("scheduleId") long scheduleId);

	public boolean isExistScheduleByInfo(@Param("email") String email, @Param("scheduleId") long scheduleId);

	public void deletePersonalSchedule(@Param("email")String email, @Param("scheduleId") long scheduleId);

	List<GetMyScheduleListDto> getMyScheduleList(
			@Param("email")
			String email,
			@Param("isGroup")
			Boolean isGroup,
			@Param("year")
			String year,
			@Param("month")
			String month);


	List<GetScheduleCategoryDto> getCategory();

    public void createSchedulePlace(Map<String, Object> dto);

	public void createGroupSchedule(Map<String, Object> dto);

	public boolean isValidateDate(@Param("createGroupScheduleDto") CreateGroupScheduleDto createGroupScheduleDto);

	public void createGroupMemberSchedule(Map<String, Object> dto);

	public int isExistGroupMember(@Param("list") List<String> inviteEmailList);

    public Optional<ScheduleDetailInfoDto> getScheduleDetailInfoDto(@Param("email") String email, @Param("scheduleId") long scheduleId);

	public List<ScheduleMemberDto> getScheduleMemberDtoList(long scheduleId);

    public List<GetScheduleListDto> getFutureScheduleList(String email);

	public boolean isExistGroupMemberByInfo(@Param("email") String email, @Param("scheduleId") long scheduleId);
	public void outGroupSchedule(@Param("email") String email, @Param("scheduleId") long scheduleId);

	public List<GetScheduleListDto> getPastScheduleList(
			@Param("email") String email,
			@Param("categoryId") Long categoryId,
			@Param("keyword") String keyword,
			@Param("pageable") Pageable pageable);

	public int countPastScheduleList(@Param("categoryId") Long categoryId, @Param("keyword") String keyword);

	public boolean isOwner(@Param("email") String email, @Param("scheduleId") long scheduleId);

	public List<String> findRegisteredEmails(@Param("emails") Set<String> emails);

	public List<String> findExistingMembers(@Param("scheduleId") long scheduleId, @Param("emails") Set<String> emails);

	public void inviteMember(@Param("scheduleId") long scheduleId, @Param("inviteMemberDto") InviteMemberDto inviteMemberDto);
}
