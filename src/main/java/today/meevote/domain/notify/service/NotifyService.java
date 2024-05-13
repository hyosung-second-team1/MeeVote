package today.meevote.domain.notify.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import today.meevote.contextholder.MemberContextHolder;
import today.meevote.domain.notify.dao.NotifyDao;
import today.meevote.domain.notify.dto.GetNotifyListDto;
import today.meevote.exception.rest.RestException;
import today.meevote.response.FailureInfo;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotifyService {

    private final NotifyDao notifyDao;

    public int getUnreadNotifyCount() {
        return notifyDao.getUnreadNotifyCount(MemberContextHolder.getEmail());
    }

    public List<GetNotifyListDto> getNotifyList() {
        return notifyDao.getNotifyList(MemberContextHolder.getEmail());
    }

    public void updateNotifyRead(long notifyId) {
        String email = MemberContextHolder.getEmail();

        String notifyEmail = notifyDao.getEmailByNotifyId(notifyId)
                .orElseThrow(() -> new RestException(FailureInfo.NOT_EXIST_NOTIFY));

        if(!email.equals(notifyEmail))
            throw new RestException(FailureInfo.NOT_NOTIFY_OWNER);

        notifyDao.updateIsRead(notifyId, true);
    }
}
