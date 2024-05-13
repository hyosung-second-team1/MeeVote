package today.meevote.response;


import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum FailureInfo {
	
	// 공통 (Z00~)
    UNAUTHENTICATED("Z97", "인증되지않은 요청입니다."),
    INVALID_INPUT("Z98", "입력값이 유효하지 않습니다."),
    INTERNAL_SERVER_ERROR("Z99", "서버 오류가 발생했습니다."),
    
    //파일 (Y00)
    IMAGE_UPLOAD_FAIL("Y00", "파일 업로드가 실패했습니다. 다시 시도해주세요."),
    EMPTY_FILE("Y01", "파일이 비어있습니다."),
    INVALID_FILE_EXENTION("Y02", "유효하지않은 파일 확장자입니다."),

    // 회원 (B00~ )
    ALREADY_EXIST_MEMBER("B00", "이미 존재하는 회원입니다."), 
    NOT_EXIST_MEMBER("B01", "존재하지 않는 회원입니다."), 
    CODE_SEND_FAIL("B02", "인증코드 전송을 실패했습니다. 유효한 메일인지 확인 후 다시 시도해주세요."), 
    NOT_CORRECT_PASSWORD("B03", "비밀번호가 일치하지 않습니다."), 
    SELF_INVITE("B04", "본인을 초대할 수 없습니다."), 
    
    // 일정
    INVALID_DATE_FORMAT("Z98","유효한 날짜 형식이 아닙니다."),
    INVALID_PLACE_INPUT("Z98", "잘못된 주소 입력입니다. 주소 입력값을 확인 후 다시 시도해주세요."),
    NOT_EXIST_CATEGORY("S01", "존재하지 않는 카테고리입니다."),
    NOT_EXIST_SCHEDULE("S02", "존재하지 않는 일정입니다."),
    NOT_EXIST_DELETE_SCHEDULE("S03", "삭제가 불가능한 일정입니다. 확인 후 다시 시도해주세요."),
    NOT_OUT_MEMBER_SCHEDULE("S04", "나가기가 불가능한 일정입니다. 확인 후 다시 시도해주세요."),
    NOT_SCHEDULE_OWNER("S98", "해당 일정의 소유자가 아닙니다."),
    NOT_EXIST_MEMBER_SCHEDULE("S99", "해당 일정의 멤버가 아닙니다."),

    // 투표중인 일정
    NOT_EXIST_VOTING_SCHEDULE("V00", "존재하지않는 투표일정입니다."),
    ALREADY_EXIST_PLACE_TO_VOTE("P00", "이미 존재하는 투표장소입니다."),
    NOT_EXIST_PLACE_TO_VOTE("P01", "존재하지않는 투표장소입니다.");
    private final String code;
    private final String message;

}
