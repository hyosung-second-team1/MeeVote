package today.meevote.response;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum SuccessInfo {
	REGISTER("회원가입이 완료되었습다."),
	LOGIN("로그인이 성공하였습니다."), 
	LOGOUT("로그아웃이 완료되었습니다."), 
	GET_MY_INFO("내 정보 조회가 완료되었습니다."), 
	GET_MAIL_CODE("메일 인증코드를 전송했습니다."), 
	UPDATE_ME("내 정보 수정이 완료되었습니다."), 
	UPDATE_PASSWORD("내 비밀번호 변경이 완료되었습니다."), 
	GET_MEMBER_FOR_INVITE("회원 조회가 완료되었습니다."), 
	VALID_EMAIL("사용가능한 이메일입니다."),

	GET_MY_SCHEDULE_LIST("내 일정 목록 조회가 완료되었습니다."),
    GET_SCHEDULE_CATEGORY("일정 카테고리 조회가 완료되었습니다."),
	GET_SCHEDULE_DETAIL("일정 상세 조회가 완료되었습니다."),
	GET_FUTURE_SCHEDULE_LIST("예정된 일정목록 조회가 완료되었습니다."),
	CREATE_SCHEDULE("내 일정 생성이 완료되었습니다."),
	CREATE_GROUP_SCHEDULE("모임 일정 생성이 완료되었습니다."),
	DELETE_SCHEDULE("일정 삭제가 완료되었습니다."),

    GET_VOTE_SCHEDULE_LIST("투표 중인 일정 목록 조회가 완료되었습니다."),
	GET_VOTE_SCHEDULE_DETAIL("투표 중인 일정 상세조회가 완료되었습니다."),
	ADD_PLACE_TO_VOTE("장소 추가가 완료되었습니다.");
    private final String code = "A00";
    private final String message;
}

