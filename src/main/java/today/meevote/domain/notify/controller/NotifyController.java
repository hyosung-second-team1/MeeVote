package today.meevote.domain.notify.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import today.meevote.domain.notify.dto.GetNotifyListDto;
import today.meevote.domain.notify.service.NotifyService;
import today.meevote.response.BaseResponse;
import today.meevote.response.DataResponse;
import today.meevote.response.SuccessInfo;

import java.util.Date;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/notify")
@Tag(name = "알림 API 명세서")
public class NotifyController {
    private final NotifyService notifyService;
    @Operation(summary = "안읽은 알림 개수 조회")
    @ApiResponse(responseCode = "1", description = "성공")
    @ApiResponse(responseCode = "2", description = "실패",
            content = @Content(examples = {
                    @ExampleObject(name = "인증되지않은 요청", value = "{\"isSuccess\": false, \"code\": \"Z97\", \"message\": \"인증되지않은 요청입니다.\"}"),
                    @ExampleObject(name = "내부 서버 오류", value = "{\"isSuccess\": false, \"code\": \"Z99\", \"message\": \"서버 오류가 발생했습니다.\"}")
            }))
    @GetMapping("/unread/count")
    public DataResponse<Integer> getUnreadNotifyCount(){
        return new DataResponse<>(SuccessInfo.GET_UNREAD_NOTIFY_COUNT,
                notifyService.getUnreadNotifyCount());
    }

    @Operation(summary = "알림 목록 조회")
    @ApiResponse(responseCode = "1", description = "성공")
    @ApiResponse(responseCode = "2", description = "실패",
            content = @Content(examples = {
                    @ExampleObject(name = "인증되지않은 요청", value = "{\"isSuccess\": false, \"code\": \"Z97\", \"message\": \"인증되지않은 요청입니다.\"}"),
                    @ExampleObject(name = "내부 서버 오류", value = "{\"isSuccess\": false, \"code\": \"Z99\", \"message\": \"서버 오류가 발생했습니다.\"}")
            }))
    @GetMapping("/list")
    public DataResponse<List<GetNotifyListDto>> getNotifyList(){
        return new DataResponse<>(SuccessInfo.GET_NOTIFY_LIST,
                notifyService.getNotifyList());
    }

    @Operation(summary = "알림 읽기 처리")
    @ApiResponse(responseCode = "1", description = "성공")
    @ApiResponse(responseCode = "2", description = "실패",
            content = @Content(examples = {
                    @ExampleObject(name = "존재하지않는 알림", value = "{\"isSuccess\": false, \"code\": \"N00\", \"message\": \"존재하지않는 알림입니다.\"}"),
                    @ExampleObject(name = "알림의 소유자가 아님", value = "{\"isSuccess\": false, \"code\": \"N01\", \"message\": \"알림의 소유자가 아닙니다.\"}"),
                    @ExampleObject(name = "인증되지않은 요청", value = "{\"isSuccess\": false, \"code\": \"Z97\", \"message\": \"인증되지않은 요청입니다.\"}"),
                    @ExampleObject(name = "내부 서버 오류", value = "{\"isSuccess\": false, \"code\": \"Z99\", \"message\": \"서버 오류가 발생했습니다.\"}")
            }))
    @PutMapping("/read")
    public BaseResponse updateNotifyRead(long notifyId){
        notifyService.updateNotifyRead(notifyId);
        return new BaseResponse(SuccessInfo.READ_NOTIFY);
    }
}
