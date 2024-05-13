package today.meevote.domain.notify.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;

@Getter
public class GetNotifyListDto {

    @Schema(description = "알림 ID", defaultValue = "1")
    private long notifyId;
    @Schema(description = "이메일", defaultValue = "test@gmail.com")
    private String email;
    @Schema(description = "일정 ID", defaultValue = "1")
    private long scheduleId;
    @Schema(description = "알림 카테고리 ID", defaultValue = "1")
    private long notifyCategoryId;
    @Schema(description = "알림 카테고리명", defaultValue = "모임 일정 초대")
    private String categoryName;
    @Schema(description = "알림 메시지", defaultValue = "[스프링부트 스터디] 모임 일정에 초대되었습니다. 장소 투표에 참여하세요!")
    private String message;
    @Schema(description = "읽었는지?", defaultValue = "false")
    private Boolean isRead;
}
