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
@NoArgsConstructor
@AllArgsConstructor
public class InviteMemberDto {

    @Schema(description = "스케줄 id", defaultValue = "1")
    @Min(value = 1, message = "스케줄 id값을 확인해주세요.")
    private long scheduleId;

    @Schema(description = "초대 이메일 목록", defaultValue = "[\"test2@gmail.com\", \"test3@gmail.com\"]")
    private List<
            @NotBlank(message = "이메일을 입력해주세요.")
            @Email(message = "유효한 이메일 형식이 아닙니다.")
                    String> inviteEmailList;
}
