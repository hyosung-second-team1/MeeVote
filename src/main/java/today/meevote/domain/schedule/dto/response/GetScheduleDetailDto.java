package today.meevote.domain.schedule.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Builder
public class GetScheduleDetailDto {
    private ScheduleDetailInfoDto scheduleDetailInfo;
    private List<ScheduleMemberDto> memberList;
}
