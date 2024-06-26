
$(document).ready(async function() {
    // 오늘 날짜 가져오기
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); // 0부터 시작하기 때문에 1을 더해줍니다.
    let yyyy = today.getFullYear();
    const todayString = yyyy + '-' + mm + '-' + dd;
    let pushCheck = {}
    let calendarEl = document.getElementById('calendar');
    let fullDate = [];

    // tit_date 요소에 오늘 날짜 표시
    $('.tit_date').text(todayString);

    // 달력 표시
    let scheduleData;
    await getCalendarSchedule();
    const calendar = displayEventsOnCalendar(scheduleData);
    
    // ajax 통해 서버에서 일정 데이터 가져오는 함수
    async function getCalendarSchedule() {
        if (pushCheck[`${yyyy}-${mm}`]) {
            scheduleData = [];
            return;
        };

        await $.ajax({
            type: 'GET',
            url: '/api/schedule/calendar',
            dataType: 'json',
            data: {
                year: yyyy,
                month: mm
            },
            success: function(response) {
                scheduleData = response.data;
                fullDate = [...fullDate, ...response.data];
            },
            error: function(xhr, status, error) {

            }
        });

        pushCheck[`${yyyy}-${mm}`] = true;

    }

    // 캘린더에 일정 표시하는 함수
    function displayEventsOnCalendar(data) {

        let calendar = new FullCalendar.Calendar(calendarEl, {
            timeZone: 'UTC',
            themeSystem: 'bootstrap5',
            initialView: 'dayGridMonth',
            // contentHeight: 600,
            editable: true,  //  드래그해서 수정 가능한지, 길게 확장도 가능
            selectable: true,
            navLinks: false,  //  요일이랑 날짜 클릭 시 일이나 주단위 보여주는 화면으로 넘어감
            select: function (info) {
                // 클릭한 날짜에 해당하는 일정 가져오기
                let selectedDate = info.start;
                let selectedEvents = getEventsForDate(selectedDate);

                // 가져온 일정을 리스트 형식으로 보여주기
                showEventsList(selectedEvents);

                // 클릭한 날짜를 tit_date에 표시
                let clickedDate = selectedDate.toISOString().slice(0, 10); // YYYY-MM-DD 형식으로 변환
                $('.tit_date').text(clickedDate);
            },

            headerToolbar: {
                start: 'today prev,next',
                center: 'title',
                right: 'customDropdownMenu'
            },

            customButtons: {
                customDropdownMenu: {
                    text: '전체',
                    click: function () {
                        $('#customDropdownMenu').toggleClass('show');

                        // drop down 메뉴 숨기는 함수
                        function hideDropdownMenu() {
                            $('#customDropdownMenu').removeClass('show');
                        }

                        // 일정 카테고리에 따라 일정 필터링하는 함수
                        function filterEventsByCategory(category) {

                            calendar.getEvents().forEach(function (event) {
                                 if (category === 'all') {
                                    // 전체 카테고리 선택 시 모든 일정을 표시합니다.
                                    event.setProp('display', 'auto');
                                } else {
                                    // 개인, 그룹 카테고리 선택 시 해당 카테고리에 맞는 일정만 표시합니다.
                                    let isGroup = event.extendedProps.isGroup;
                                    if ((category === 'personal' && !isGroup) || (category === 'group' && isGroup)) {
                                        event.setProp('display', 'auto');
                                    } else {
                                        event.setProp('display', 'none');
                                    }
                                }
                            });
                        }

                        $(document).ready(function() {
                            // 리스트 요소 클릭 시 드롭다운 버튼의 텍스트 변경
                            $('#customDropdownMenu .dropdown-item').click(function (e) {
                                e.preventDefault();
                                let newText = $(this).text(); // 클릭된 리스트 요소의 텍스트 가져오기
                                $('.fc-customDropdownMenu-button').text(newText); // 드롭다운 버튼의 텍스트 변경
                                $('#customDropdownMenu').removeClass('show');
                                filterEventsByCategory($(this).data('category'));
                            });
                        });

                        // customDropdownMenu 위치 조정
                        $('#customDropdownMenu').css({
                            'position': 'absolute',
                            'top': $('.fc-customDropdownMenu-button').offset().top + $('.fc-customDropdownMenu-button').outerHeight()+5,
                            'left': $('.fc-customDropdownMenu-button').offset().left - $('#customDropdownMenu').outerWidth() + $('.fc-customDropdownMenu-button').outerWidth()+5
                        });


                    }

                }
            },


            initialDate: todayString, // 달력 처음 로드될 때 표시되는 날짜, default 는 현재 날짜
            editable: false,
            dayMaxEvents: true, // +more 표시 전 최대 이벤트 갯수, true는 셀 높이에 의해 결정
            eventLimit: true,
            events: data.map(function (event) {
                return {
                    title: event.name,
                    start: event.startDate,
                    // propA: event.description,  -> 일정 상세는 데이터 안 받아오네...
                    backgroundColor: event.color,
                    isGroup: event.isGroup,
                    textColor: "#ffffff"
                };
            }),

        });

        return calendar;
    }

    calendar.render();

    // prev 버튼 클릭 이벤트 핸들러
    calendarEl.querySelector('.fc-prev-button').addEventListener('click', async function() {
        today.setMonth(today.getMonth() - 1);
        dd = String(today.getDate()).padStart(2, '0');
        mm = String(today.getMonth() + 1).padStart(2, '0'); // 0부터 시작하기 때문에 1을 더해줍니다.
        yyyy = today.getFullYear();
        await getCalendarSchedule();
        const addData = scheduleData.map(function (event) {
            return {
                title: event.name,
                start: event.startDate,
                // propA: event.description,  -> 일정 상세는 데이터 안 받아오네...
                backgroundColor: event.color,
                textColor: "#ffffff"
            };
        })
        $.each(addData, function (idx, data) { 
            calendar.addEvent(data);
        });
    });

    // next 버튼 클릭 이벤트 핸들러
    calendarEl.querySelector('.fc-next-button').addEventListener('click', async function() {
        today.setMonth(today.getMonth() + 1);
        dd = String(today.getDate()).padStart(2, '0');
        mm = String(today.getMonth() + 1).padStart(2, '0'); // 0부터 시작하기 때문에 1을 더해줍니다.
        yyyy = today.getFullYear();
        await getCalendarSchedule();
        const addData = scheduleData.map(function (event) {
            return {
                title: event.name,
                start: event.startDate,
                // propA: event.description,  -> 일정 상세는 데이터 안 받아오네...
                backgroundColor: event.color,
                textColor: "#ffffff"
            };
        })
        $.each(addData, function (idx, data) { 
            calendar.addEvent(data);
        });
    });

        

    // 클릭한 날짜에 해당하는 일정을 가져오는 함수
    function getEventsForDate(date) {
        // 클릭한 날짜에 해당하는 일정 데이터를 필터링하여 반환
        return fullDate.filter(event => new Date(event.startDate).toDateString() === date.toDateString());
    }

    // 클릭한 날짜에 해당하는 일정을 리스트 형식으로 보여주는 함수
    function showEventsList(events) {
        // 우측 사이드바에 있는 일정 목록을 참조
        let sidebar = $('.area_agenda_info');

        // 기존에 있는 일정 목록을 초기화
        sidebar.empty();

        // 가져온 일정 데이터를 시작 시간을 기준으로 정렬
        events.sort((a, b) => {
            return new Date(a.startDate) - new Date(b.startDate);
        });

        // 가져온 일정 데이터를 리스트 형식으로 추가
        let ul = $('<ul>').addClass('events-list').css({
            'display': 'flex',
            'flex-direction': 'column'
        });


        events.forEach(event => {
            let li = $('<li>').addClass('event-item');
            // 시간 정보 추가
            let dateTimeArray = event.startDate.split(' ');
            let date = dateTimeArray[0]; // 날짜 부분
            let full_time = dateTimeArray[1]; // 시간 부분  00:00
            let TimeArray = full_time.split(':');
            let hour = TimeArray[0];
            let min = TimeArray[1];
            let timeSpan = $('<span>').text(`${hour}:${min}`).addClass('event-time').css('margin-right', '3px');
            li.append(timeSpan);

            // 일정에 해당하는 카테고리의 색상 적용
            let colorBar = $('<span>').addClass('color-bar').css({
                'background-color': event.color,
                'display': 'inline-block',
                'width': '4px',
                'margin-right': '5px',
                'margin-left': '5px'
            });
            li.append(colorBar);

            // 제목과 상세 정보 추가
            let titleAndDetail = $('<div>').addClass('title-and-detail').css({
                'display': 'flex',
                'flex-direction': 'column',
                'flex': '1'
            });
            let titleSpan = $('<span>').text(event.name).addClass('event-title').css('margin-bottom', '5px');
            let detailSpan = $('<span>').text(event.description).addClass('event-detail');
            titleAndDetail.append(titleSpan, detailSpan);
            li.append(titleAndDetail);

            // 클릭 이벤트 추가
            li.on('click', function () {
                location.href = `/schedule/detail?scheduleId=${event.scheduleId}`
            });

            ul.append(li);
        });

        // 리스트를 우측 사이드바에 추가
        sidebar.append(ul);
    }





});

