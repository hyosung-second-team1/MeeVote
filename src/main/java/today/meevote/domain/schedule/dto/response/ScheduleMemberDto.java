package today.meevote.domain.schedule.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;

@Getter
public class ScheduleMemberDto {
    @Schema(description = "이메일", defaultValue = "test@gmail.com")
    private String email;
    @Schema(description = "이름", defaultValue = "김철수")
    private String name;
    @Schema(description = "주소", defaultValue = "서울특별시 서대문구 거북골로 34")
    private String address;
    @Schema(description = "프로필 이미지 경로", defaultValue = "default.jpg")
    private String imgSrc;
    @Schema(description = "모임장 여부", defaultValue = "true")
    private Boolean isOwner;
    @Schema(description = "출발지 이름", defaultValue = "한성대학교 중소기업직업훈련컨소시엄")
    private String departurePlaceName;
    @Schema(description = "출발지 위도", defaultValue = "37.58374455901329")
    private String lat;
    @Schema(description = "출발지 경도", defaultValue = "126.99994905271778")
    private String lng;
}
