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
	GET_MEMBER_LIST_FOR_INVITE("이름으로 회원목록 검색이 완료되었습니다."),

	VALID_EMAIL("사용가능한 이메일입니다."),

	GET_MY_SCHEDULE_LIST("내 일정 목록 조회가 완료되었습니다."),
    GET_SCHEDULE_CATEGORY("일정 카테고리 조회가 완료되었습니다."),
	GET_SCHEDULE_DETAIL("일정 상세 조회가 완료되었습니다."),
	GET_FUTURE_SCHEDULE_LIST("예정된 일정목록 조회가 완료되었습니다."),
	CREATE_SCHEDULE("내 일정 생성이 완료되었습니다."),
	CREATE_GROUP_SCHEDULE("모임 일정 생성이 완료되었습니다."),
	DELETE_SCHEDULE("일정 삭제가 완료되었습니다."),
	OUT_SCHEDULE("일정 나가기가 완료되었습니다."),
	INVITE_GROUP_SCHEDULE("모임 일정 멤버 초대가 완료되었습니다."),

    GET_VOTE_SCHEDULE_LIST("투표 중인 일정 목록 조회가 완료되었습니다."),
	GET_VOTE_SCHEDULE_DETAIL("투표 중인 일정 상세조회가 완료되었습니다."),
	ADD_PLACE_TO_VOTE("장소 추가가 완료되었습니다."),
	TOGGLE_VOTE_PLACE("장소 투표/투표취소가 완료되었습니다."),
	UPDATE_DEPARTURE_PLACE("내 출발지 수정하기가 완료되었습니다."),
	DELETE_DEPARTURE_PLACE("내 출발지 삭제가 완료되었습니다."),
	CONFIRM_PLACE("장소 확정을 완료하였습니다."),

    GET_UNREAD_NOTIFY_COUNT("안읽은 알림 개수 조회가 완료되었습니다."),

	GET_NOTIFY_LIST("알림 목록 조회가 완료되었습니다."),

	READ_NOTIFY("알림 읽기 처리가 완료되었습니다."),
	READ_ALL_NOTIFY("모든 알림 읽기 처리가 완료되었습니다."),

	// 통계
	GET_MY_CATEGORY_STATS("내 일정 카테고리 통계 조회가 완료되었습니다."),
	GET_MY_SCHEDULE_STATS("내 일정 통계 조회가 완료되었습니다.");
    private final String code = "A00";
    private final String message;
}

