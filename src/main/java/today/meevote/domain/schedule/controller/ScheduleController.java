package today.meevote.domain.schedule.controller;

import jakarta.validation.constraints.Pattern;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.web.PageableDefault;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import today.meevote.domain.schedule.dto.request.*;
import today.meevote.domain.schedule.dto.response.*;
import today.meevote.domain.schedule.service.ScheduleService;
import today.meevote.response.BaseResponse;
import today.meevote.response.DataResponse;
import today.meevote.response.SuccessInfo;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/schedule")
@Tag(name = "일정 API 명세서")
@Validated
public class ScheduleController {

	private final ScheduleService scheduleService;

	@Operation(summary = "내 일정 생성")
	@ApiResponse(responseCode = "1", description = "성공")
	@ApiResponse(responseCode = "2", description = "실패",
			content = @Content(examples = {
					@ExampleObject(name = "존재하지않는 회원", value = "{\"isSuccess\": false, \"code\": \"B01\", \"message\": \"존재하지않는 회원입니다.\"}"),
					@ExampleObject(name = "존재하지않는 카테고리", value = "{\"isSuccess\": false, \"code\": \"S01\", \"message\": \"존재하지 않는 카테고리입니다.\"}"),
					@ExampleObject(name = "인증되지않은 요청", value = "{\"isSuccess\": false, \"code\": \"Z97\", \"message\": \"인증되지않은 요청입니다.\"}"),
					@ExampleObject(name = "유효하지않은 입력값", value = "{\"isSuccess\": false, \"code\": \"Z98\", \"message\": \"입력값이 유효하지 않습니다.\"}"),
					@ExampleObject(name = "내부 서버 오류", value = "{\"isSuccess\": false, \"code\": \"Z99\", \"message\": \"서버 오류가 발생했습니다.\"}")
			}))
	@PostMapping("/personal")
	public BaseResponse createPersonalSchedule(@Valid @RequestBody CreatePersonalScheduleDto dto) {
		scheduleService.createPersonalSchedule(dto);
		return new BaseResponse(SuccessInfo.CREATE_SCHEDULE);
	}

	@Operation(summary = "내 일정 삭제")
	@ApiResponse(responseCode = "1", description = "성공")
	@ApiResponse(responseCode = "2", description = "실패",
			content = @Content(examples = {
					@ExampleObject(name = "존재하지않는 회원", value = "{\"isSuccess\": false, \"code\": \"B01\", \"message\": \"존재하지않는 회원입니다.\"}"),
					@ExampleObject(name = "존재하지않는 일정", value = "{\"isSuccess\": false, \"code\": \"S02\", \"message\": \"존재하지 않는 일정입니다.\"}"),
					@ExampleObject(name = "인증되지않은 요청", value = "{\"isSuccess\": false, \"code\": \"Z97\", \"message\": \"인증되지않은 요청입니다.\"}"),
					@ExampleObject(name = "내부 서버 오류", value = "{\"isSuccess\": false, \"code\": \"Z99\", \"message\": \"서버 오류가 발생했습니다.\"}")
			}))
	@DeleteMapping("/personal")
	public BaseResponse deletePersonalSchedule(
			@Schema(description = "스케줄 id", defaultValue = "1")
			@Min(value = 1, message = "스케줄 id값을 확인해주세요.")
			@RequestParam
			long scheduleId
	) {
		scheduleService.deletePersonalSchedule(scheduleId);
		return new BaseResponse(SuccessInfo.DELETE_SCHEDULE);
	}

	@Operation(summary = "캘린더 일정조회")
	@ApiResponse(responseCode = "1", description = "성공")
	@ApiResponse(responseCode = "2", description = "실패",
			content = @Content(examples = {
					@ExampleObject(name = "인증되지않은 요청", value = "{\"isSuccess\": false, \"code\": \"Z97\", \"message\": \"인증되지않은 요청입니다.\"}"),
					@ExampleObject(name = "유효하지않은 입력값", value = "{\"isSuccess\": false, \"code\": \"Z98\", \"message\": \"입력값이 유효하지 않습니다.\"}"),
					@ExampleObject(name = "내부 서버 오류", value = "{\"isSuccess\": false, \"code\": \"Z99\", \"message\": \"서버 오류가 발생했습니다.\"}")
			}))
	@GetMapping("/calendar")
	public DataResponse<List<GetMyScheduleListDto>> getMyScheduleList(
			@RequestParam(required = false)
			Boolean isGroup,

			@Schema(description = "년도", defaultValue = "2024")
			@NotBlank(message = "년도를 입력해주세요.")
			@Pattern(regexp = "^[1-9]\\d{3}$", message = "올바른 년도 형식이 아닙니다.")
			String year,

			@Schema(description = "월", defaultValue = "05")
			@NotBlank(message = "월을 입력해주세요.")
			@Pattern(regexp = "^(0[1-9]|1[0-2])$", message = "올바른 월 형식이 아닙니다.")
			String month) {

		return new DataResponse<>(SuccessInfo.GET_MY_SCHEDULE_LIST,
				scheduleService.getMyScheduleList(isGroup, year, month));
	}

	@Operation(summary = "일정 카테고리 조회")
	@ApiResponse(responseCode = "1", description = "성공")
	@ApiResponse(responseCode = "2", description = "실패",
			content = @Content(examples = {
					@ExampleObject(name = "인증되지않은 요청", value = "{\"isSuccess\": false, \"code\": \"Z97\", \"message\": \"인증되지않은 요청입니다.\"}"),
					@ExampleObject(name = "내부 서버 오류", value = "{\"isSuccess\": false, \"code\": \"Z99\", \"message\": \"서버 오류가 발생했습니다.\"}")
			}))
	@GetMapping("/category")
	public DataResponse<List<GetScheduleCategoryDto>> getScheduleCategory() {
		return new DataResponse<>(SuccessInfo.GET_SCHEDULE_CATEGORY, scheduleService.getCategory());
	}


	@Operation(summary = "모임 일정 생성하기")
	@ApiResponse(responseCode = "1", description = "성공")
	@ApiResponse(responseCode = "2", description = "실패",
			content = @Content(examples = {
					@ExampleObject(name = "존재하지않는 회원", value = "{\"isSuccess\": false, \"code\": \"B01\", \"message\": \"존재하지않는 회원입니다.\"}"),
					@ExampleObject(name = "존재하지않는 카테고리", value = "{\"isSuccess\": false, \"code\": \"S01\", \"message\": \"존재하지 않는 카테고리입니다.\"}"),
					@ExampleObject(name = "인증되지않은 요청", value = "{\"isSuccess\": false, \"code\": \"Z97\", \"message\": \"인증되지않은 요청입니다.\"}"),
					@ExampleObject(name = "유효하지않은 입력값", value = "{\"isSuccess\": false, \"code\": \"Z98\", \"message\": \"입력값이 유효하지 않습니다.\"}"),
					@ExampleObject(name = "내부 서버 오류", value = "{\"isSuccess\": false, \"code\": \"Z99\", \"message\": \"서버 오류가 발생했습니다.\"}")
			}))
	@PostMapping("/group")
	public DataResponse<Map> createGroupSchedule(@Valid @RequestBody CreateGroupScheduleDto createGroupScheduleDto){
		long scheduleId = scheduleService.createGroupSchedule(createGroupScheduleDto);
		Map<String, Object> responseMap = new HashMap<>();
		responseMap.put("scheduleId", scheduleId);

		return new DataResponse(SuccessInfo.CREATE_GROUP_SCHEDULE, responseMap);
	}

	@Operation(summary = "일정 상세조회")
	@ApiResponse(responseCode = "1", description = "성공")
	@ApiResponse(responseCode = "2", description = "실패",
			content = @Content(examples = {
					@ExampleObject(name = "존재하지않는 일정", value = "{\"isSuccess\": false, \"code\": \"S02\", \"message\": \"존재하지 않는 일정입니다.\"}"),
					@ExampleObject(name = "인증되지않은 요청", value = "{\"isSuccess\": false, \"code\": \"Z97\", \"message\": \"인증되지않은 요청입니다.\"}"),
					@ExampleObject(name = "내부 서버 오류", value = "{\"isSuccess\": false, \"code\": \"Z99\", \"message\": \"서버 오류가 발생했습니다.\"}")
			}))
	@GetMapping("/detail")
	public DataResponse<GetScheduleDetailDto> getScheduleDetail(
			@Schema(description = "스케줄 id", defaultValue = "1")
			@Min(value = 1, message = "스케줄 id값을 확인해주세요.")
			long scheduleId){
		return new DataResponse<>(SuccessInfo.GET_SCHEDULE_DETAIL,
				scheduleService.getScheduleDetail(scheduleId));
	}

	@Operation(summary = "지난 일정목록 조회")
	@ApiResponse(responseCode = "1", description = "성공")
	@ApiResponse(responseCode = "2", description = "실패",
			content = @Content(examples = {
					@ExampleObject(name = "존재하지않는 일정", value = "{\"isSuccess\": false, \"code\": \"S02\", \"message\": \"존재하지 않는 일정입니다.\"}"),
					@ExampleObject(name = "인증되지않은 요청", value = "{\"isSuccess\": false, \"code\": \"Z97\", \"message\": \"인증되지않은 요청입니다.\"}"),
					@ExampleObject(name = "내부 서버 오류", value = "{\"isSuccess\": false, \"code\": \"Z99\", \"message\": \"서버 오류가 발생했습니다.\"}")
			}))
	@GetMapping("/past/list")
	public DataResponse<Page<GetScheduleListDto>> getPastScheduleList(
			@Schema(description = "카테고리 id", defaultValue = "1")
			@Min(value = 1, message = "카테고리 id값을 확인해주세요.")
			long categoryId,
			@RequestParam(required = false)
			@Schema(description = "키워드 검색어", defaultValue = "일정명1")
			String keyword,
			@ParameterObject
			@PageableDefault(size = 10)
			Pageable pageable){
		return new DataResponse<>(SuccessInfo.GET_SCHEDULE_CATEGORY, scheduleService.getPastScheduleList(categoryId, keyword, pageable));
	}

	@Operation(summary = "예정 중인 일정목록 조회")
	@ApiResponse(responseCode = "1", description = "성공")
	@ApiResponse(responseCode = "2", description = "실패",
			content = @Content(examples = {
					@ExampleObject(name = "인증되지않은 요청", value = "{\"isSuccess\": false, \"code\": \"Z97\", \"message\": \"인증되지않은 요청입니다.\"}"),
					@ExampleObject(name = "내부 서버 오류", value = "{\"isSuccess\": false, \"code\": \"Z99\", \"message\": \"서버 오류가 발생했습니다.\"}")
			}))
	@GetMapping("/future/list")
	public DataResponse<List<GetScheduleListDto>> getFutureScheduleList(){
		return new DataResponse<>(SuccessInfo.GET_FUTURE_SCHEDULE_LIST,
				scheduleService.getFutureScheduleList());
	}

	@Operation(summary = "일정 나가기")
	@ApiResponse(responseCode = "1", description = "성공")
	@ApiResponse(responseCode = "2", description = "실패",
			content = @Content(examples = {
					@ExampleObject(name = "나갈 수 없는 일정", value = "{\"isSuccess\": false, \"code\": \"S03\", \"message\": \"삭제가 불가능한 일정입니다. 확인 후 다시 시도해주세요.\"}"),
					@ExampleObject(name = "인증되지않은 요청", value = "{\"isSuccess\": false, \"code\": \"Z97\", \"message\": \"인증되지않은 요청입니다.\"}"),
					@ExampleObject(name = "내부 서버 오류", value = "{\"isSuccess\": false, \"code\": \"Z99\", \"message\": \"서버 오류가 발생했습니다.\"}")
			}))
	@DeleteMapping("/out")
	public BaseResponse outSchedule(
			@Schema(description = "스케줄 id", defaultValue = "1")
			@Min(value = 1, message = "스케줄 id값을 확인해주세요.")
			long scheduleId){
		scheduleService.outGroupSchedule(scheduleId);
		return new BaseResponse(SuccessInfo.OUT_SCHEDULE);
	}

	@Operation(summary = "일정에 회원 초대하기")
	@ApiResponse(responseCode = "1", description = "성공")
	@ApiResponse(responseCode = "2", description = "실패",
			content = @Content(examples = {
					@ExampleObject(name = "일정 소유자가 아님", value = "{\"isSuccess\": false, \"code\": \"S98\", \"message\": \"해당 일정의 소유자가 아닙니다.\"}"),
					@ExampleObject(name = "존재하지 않는 회원", value = "{\"isSuccess\": false, \"code\": \"B01\", \"message\": \"존재하지 않는 회원입니다.\"}"),
					@ExampleObject(name = "이미 존재하는 회원", value = "{\"isSuccess\": false, \"code\": \"B00\", \"message\": \"이미 존재하는 회원입니다.\"}"),
					@ExampleObject(name = "인증되지않은 요청", value = "{\"isSuccess\": false, \"code\": \"Z97\", \"message\": \"인증되지않은 요청입니다.\"}"),
					@ExampleObject(name = "내부 서버 오류", value = "{\"isSuccess\": false, \"code\": \"Z99\", \"message\": \"서버 오류가 발생했습니다.\"}")
			}))
	@PostMapping("/invite")
	public BaseResponse inviteMember(InviteMemberDto inviteMemberDto){
		scheduleService.inviteMember(inviteMemberDto);
		return new BaseResponse(SuccessInfo.INVITE_GROUP_SCHEDULE);
	}


}