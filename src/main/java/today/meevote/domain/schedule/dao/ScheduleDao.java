package today.meevote.domain.schedule.dao;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import jakarta.validation.Valid;
import today.meevote.domain.schedule.dto.request.CreateGroupScheduleDto;
import today.meevote.domain.schedule.dto.request.CreatePersonalScheduleDto;
import today.meevote.domain.schedule.dto.response.*;

@Mapper
public interface ScheduleDao {
	
	public boolean isExistByEmail(String email);
	
	public boolean isCategoryExist(int categoryId);
	
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

	public void createOwnerMemberSchedule(Map<String, Object> dto);

	public void createGroupMemberSchedule(Map<String, Object> dto);

	public int isExistGroupMember(CreateGroupScheduleDto createGroupScheduleDto);

    public Optional<ScheduleDetailInfoDto> getScheduleDetailInfoDto(String email, long scheduleId);

	public List<ScheduleMemberDto> getScheduleMemberDtoList(long scheduleId);

    public List<GetScheduleListDto> getFutureScheduleList(String email);

	public boolean isExistGroupMemberByInfo(String email, long scheduleId);
	public void outGroupSchedule(String email, long scheduleId);
}
