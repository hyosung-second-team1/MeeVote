package today.meevote.domain.schedule.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateGroupScheduleDto {

    @NotBlank(message = "일정 이름을 입력해주세요.")
    @Schema(description = "일정명", defaultValue = "일정명1")
    private String name;

    @Schema(description = "일정 설명", defaultValue = "일정 설명입니다.")
    private String description;

    @Min(value=1, message = "카테고리를 선택해주세요.")
    @Schema(description = "일정 카테고리 ID", defaultValue = "1")
    private long scheduleCategoryId;

    @NotBlank(message = "일정 시작일을 입력해주세요.")
    @Schema(description = "일정 시작일", defaultValue = "2024-05-07 15:00")
    private String startDate;

    @NotBlank(message = "일정 종료일을 입력해주세요.")
    @Schema(description = "일정 종료일", defaultValue = "2024-05-08 21:00")
    private String endDate;

    @Schema(description = "초대 이메일 목록", defaultValue = "[\"test2@gmail.com\", \"test3@gmail.com\"]")
    private List<
            @NotBlank(message = "이메일을 입력해주세요.")
            @Email(message = "유효한 이메일 형식이 아닙니다.")
            String> inviteEmailList;

    @NotBlank(message = "투표 종료일을 입력해주세요.")
    @Schema(description = "투표 종료일", defaultValue = "2024-05-08 21:00")
    private String voteDeadline;
}
