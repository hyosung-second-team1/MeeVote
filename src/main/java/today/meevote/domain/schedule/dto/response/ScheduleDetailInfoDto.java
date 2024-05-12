package today.meevote.domain.schedule.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;

@Getter
public class ScheduleDetailInfoDto {
    @Schema(description = "일정 ID", defaultValue = "1")
    private long scheduleId;
    @Schema(description = "카테고리 ID", defaultValue = "2")
    private long scheduleCategoryId;
    @Schema(description = "카테고리명", defaultValue = "스터디")
    private String categoryName;
    @Schema(description = "색상", defaultValue = "green")
    private String color;
    @Schema(description = "일정명", defaultValue = "스프링부트 스터디")
    private String name;
    @Schema(description = "일정 설명", defaultValue = "스프링부트 마스터하기")
    private String description;
    @Schema(description = "시작일시", defaultValue = "2024-05-8 09:00")
    private String startDate;
    @Schema(description = "종료일시", defaultValue = "2024-05-10 23:00")
    private String endDate;
    @Schema(description = "모임여부", defaultValue = "0")
    private Boolean isGroup;
    @Schema(description = "약속장소명", defaultValue = "서울시 서초구")
    private String placeName;
    @Schema(description = "약속장소 위도", defaultValue = "37.491810664483")
    private String lat;
    @Schema(description = "약속장소 경도", defaultValue = "37.491810664483")
    private String lng;
    @Schema(description = "요청자가 모임장이면 true, 아니면 false", defaultValue = "true")
    private boolean isRequesterOwner;
}
