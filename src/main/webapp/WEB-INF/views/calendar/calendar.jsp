<%@ page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>main page</title>
    <!-- bootstrap css -->
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
      rel="stylesheet"
      integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
      crossorigin="anonymous"
    />
    <!-- FullCalendar -->
    <script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.11/index.global.min.js"></script>

    <!-- bootstrap js-->
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
      rel="stylesheet"
      integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
      crossorigin="anonymous" defer
    />
    <!--bootstrap icon-->
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
    />

    <!-- jquery -->
    <script src="https://code.jquery.com/jquery-3.7.1.min.js" defer></script>

    <link rel="stylesheet" href="/css/calendar.css" />

    <!--폰트-->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Nanum+Gothic+Coding&display=swap"
      rel="stylesheet"
    />
    <!-- 사이드바 -->
    <link rel="stylesheet" href="/css/inc/sidebar.css" />
    <script src="/js/inc/sidebar.js" defer></script>

    <!-- 알람 -->
    <link rel="stylesheet" href="/css/inc/alarm.css" />
    <script src="/js/inc/alarm.js" defer></script>


    <script src="/js/calendar.js" defer></script>
<%--    <script--%>
<%--            src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"--%>
<%--            integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"--%>
<%--            crossorigin="anonymous" defer--%>
<%--    ></script>--%>

  </head>

  <body>
<%--    <i class="bi bi-bell"></i>--%>

    <!-- 사이드바 include -->
    <jsp:include page="/WEB-INF/views/inc/sidebar.jsp">
      <jsp:param value="calendar" name="pageName" />
    </jsp:include>

    <!-- 알람 include -->
    <jsp:include page="/WEB-INF/views/inc/alarm.jsp">
      <jsp:param value="calendar" name="scheduleName" />
    </jsp:include>

    <div class="full-contentbox">
      <!--메인부분-->
      <div class="calAndSide">

        <!--달력과 우측 사이드가 들어갈 부분-->
        <div class="main">
          <!--달력이 들어갈 부분-->
          <div id="calendar"></div>


          <!-- drop down -->
          <div id="customDropdownMenu" class="dropdown-menu">
            <a class="dropdown-item" href="#" data-category="all">전체 일정</a>
            <a class="dropdown-item" href="#" data-category="personal">개인 일정</a>
            <a class="dropdown-item" href="#" data-category="group">그룹 일정</a>
          </div>

          <!--우측 사이드바가 들어갈 부분-->
          <div class="agenda_wrap">
            <div class="area_agenda">
              <h2 class="area_date" aria-live="assertive">
                <strong class="tit_date"></strong>
              </h2>
            </div>
            <div class="area_agenda_info">
              <ul class="info"></ul>
            </div>
          </div>
        </div>
      </div>
    </div>

<%--    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>--%>
<%--    <script src="/js/calendar.js"></script>--%>
<%--    <script--%>
<%--      src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"--%>
<%--      integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"--%>
<%--      crossorigin="anonymous"--%>
<%--    ></script>--%>
  <ul>
    <li>
      <li>

    </li>
  </ul>
  </body>
</html>
