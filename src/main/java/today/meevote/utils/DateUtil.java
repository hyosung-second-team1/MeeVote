package today.meevote.utils;

import today.meevote.exception.rest.RestException;
import today.meevote.response.FailureInfo;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class DateUtil {
    private static final String DATE_FORMAT = "yyyy-MM-dd HH:mm";

    private static SimpleDateFormat getDateFormat() {
        SimpleDateFormat dateFormat = new SimpleDateFormat(DATE_FORMAT);
        dateFormat.setLenient(false);
        return dateFormat;
    }

    public static void validateDateOrder(String startDateStr, String endDateStr) {
         try {
            Date startDate = getDateFormat().parse(startDateStr);
            Date endDate = getDateFormat().parse(endDateStr);

             if (!startDate.before(endDate)) {
                 throw new RestException(FailureInfo.INVALID_DATE_FORMAT);
             }
        } catch (ParseException e) {
             throw new RestException(FailureInfo.INVALID_DATE_FORMAT);
        }
    }

    public static void validateDateOrder(String startDateStr, String endDateStr, String voteDateStr) {
        try {
            Date startDate = getDateFormat().parse(startDateStr);
            Date endDate = getDateFormat().parse(endDateStr);
            Date voteDate = getDateFormat().parse(voteDateStr);
            if (!startDate.before(endDate)) {
                throw new RestException(FailureInfo.INVALID_DATE_FORMAT);
            }
        } catch (ParseException e) {
            throw new RestException(FailureInfo.INVALID_DATE_FORMAT);
        }
    }
}
