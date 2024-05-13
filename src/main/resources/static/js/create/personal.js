// 변수
// ---- 달력 관련 변수 ----
let date = new Date();
let year = date.getFullYear();
let month = date.getMonth();
// ---- 날짜 입력값 변수 ----
let isAllDay = false;
let startDate = new Date();;
let endDate = new Date();
// ---- 카테고리 변수 ----
let categoryList = [];
let choosedCategory;
// ---- 장소 변수 ----
let placeList = [];
let choosedPlace = {place_name: '', x: '', y: ''};

// 변수 End

// 함수
// ---- 함수 : 달력 표시----
function calendarDisplay() {
	// 달력 비우기
	$('.calendar-dates').children().remove();

	// 기준 날짜 추출
	let dayone = new Date(year, month, 1).getDay();
	let lastdate = new Date(year, month + 1, 0).getDate();
	let dayend = new Date(year, month, lastdate).getDay();
	let monthlastdate = new Date(year, month, 0).getDate();

	// 달력에 넣을 엘리먼트 생성
	const dateList = [];

	for (let i = dayone; i > 0; i--) {
		const td = $('<td></td>');
		td.addClass('inactive');
		td.text(`${monthlastdate - i + 1}`);
		dateList.push(td);
	}

	for (let i = 1; i <= lastdate; i++) {
		const td = $('<td></td>');
		td.text(`${i}`)
		// 시작 날짜와 종료 날짜 그리고 그 사이 날짜 표시
		const calendarDate = new Date(`${year}-${month+1}-${i}`);
		if (i === startDate.getDate() && month === startDate.getMonth() && year === startDate.getFullYear()) {
			td.addClass('start-date-calendar');
		} 
		if ((i === endDate.getDate() && month === endDate.getMonth() && year === endDate.getFullYear())) {
			td.addClass('end-date-calendar');
		} 
		if (calendarDate > startDate && calendarDate < endDate ) {
			td.addClass('between-date-calendar');
		}
		dateList.push(td);
	}

	for (let i = dayend; i < 6; i++) {
		const td = $('<td></td>');
		td.addClass('inactive');
		td.text(`${i - dayend + 1}`);
		dateList.push(td);
	}
	
	// 달력에 날짜 엘리먼트 추가
	let count = 0;
	let tr = $('<tr></tr>')
	tr.addClass('calendar-row')
	$.each(dateList, function (index, el) {
		// 일요일 빨간색 표시, 토요일 파란색 표시
		if (count === 0 && !el.hasClass('inactive')) el.css('color', 'tomato');
		else if (count === 6 && !el.hasClass('inactive')) el.css('color', 'blueviolet');
		// 행에 날짜 추가
		tr.append(el)
		count++;
		// 7개의 날짜 엘리먼트를 추가한후 ul 초기화
		if (count === 7) {
			$('.calendar-dates').append(tr);
			tr = $('<tr></tr>');
			tr.addClass('calendar-row');
			count = 0;
		}
	});

	// 년월 표시
	$('.calendar-current-date').text(`${year}년 ${month+1}월`);
}
// ---- 함수 : 달력 표시 End ----

// ---- 함수 : 입력값 날짜 동기화 ----
function inputToDate(selector, selectDate) {
	let inputDate = new Date($(selector).val());
	selectDate.setFullYear(inputDate.getFullYear());
	selectDate.setMonth(inputDate.getMonth());
	selectDate.setDate(inputDate.getDate());
}

function dateToInput(selector, selectDate) {
	const y = selectDate.getFullYear();
	const m = ('0' + (selectDate.getMonth() + 1)).slice(-2);
	const d = ('0' + selectDate.getDate()).slice(-2);
	$(selector).val(`${y}-${m}-${d}`);
}

function inputToTime(selector, selectDate) {
	let inputTime = $(selector).val().split(':');
	selectDate.setHours(inputTime[0]);
	selectDate.setMinutes(inputTime[1]);
}

function timeToInput(selector, selectDate) {
	const h = ('0' + (selectDate.getHours())).slice(-2);
	const mm = ('0' + (selectDate.getMinutes())).slice(-2);
	$(selector).val(`${h}:${mm}`);
}
// ---- 함수 : 입력값 날짜 동기화 End ----

// ---- 함수 : 종료 날짜를 시작날짜 자정으로 맞추기 ----
function allDaySync() {
	endDate = new Date(startDate);
	endDate.setHours('23');
	endDate.setMinutes('59');
	dateToInput('#end-date', endDate);
	timeToInput('#end-time', endDate);
	calendarDisplay();
}
// ---- 함수 : 종료 날짜를 시작날짜 자정으로 맞추기 End ----

// ---- 함수 : 장소 검색 ----
async function searchPlace(keyword) {
	const ps = new kakao.maps.services.Places(); 
	ps.keywordSearch(keyword, (data, status, pagination) => {
		placeList = [];
		if (status === kakao.maps.services.Status.OK) placeList = data;
		console.log('1', data);
	});
}
// ---- 함수 : 카카오 맵 검색 End----
// 함수 End
 


// 이벤트 등록
// ---- 이벤트 등록 : 달력 넘기기 ----
$.each($('.calendar-navigation span'), function(index, icon) {
	$(icon).click(function(e) {
		month = icon.id === 'calendar-prev' ? month - 1 : month + 1;
		if (month < 0 || month > 11) {
				date = new Date(year, month, new Date().getDate());
				year = date.getFullYear();
				month = date.getMonth();
		}
		else {
				date = new Date();
		}
		calendarDisplay();
	})
})
// ---- 이벤트 등록 : 달력 넘기기 End ----

// ---- 이벤트 등록 : 이름 입력 ----
$('#name-container > input').one('input', function(e) {
	if($(this).hasClass('is-invalid')) {
		$(this).removeClass('is-invalid');
	}
})
// ---- 이벤트 등록 : 이름 입력 End ----

// ---- 이벤트 등록 : 날짜 및 시간 등록 ----
$('#start-date').change(function (e) {
	inputToDate(this, startDate);
	// 시작 날짜가 종료 날짜보다 크면 종료 날짜 자동 조정
	if (isAllDay) {
		allDaySync();
	}
	else if (startDate > endDate) {
		endDate = new Date(startDate);
		dateToInput('#end-date', endDate);
		timeToInput('#end-time', endDate);
	}
	calendarDisplay();
});

$('#start-time').change(function (e) {
	inputToTime(this, startDate);
	// 시작 날짜 종료 날짜보다 크면 종료 날짜 자동 조정
	if (startDate > endDate) {
		endDate = new Date(startDate);
		dateToInput('#end-date', endDate);
		timeToInput('#end-time', endDate);
	}
	calendarDisplay();
});

$('#end-date').change(function (e) {
	inputToDate(this, endDate);
	// 시작 날짜가 종료 날짜보다 크면 시작 날짜 자동 조정
	if (startDate > endDate) {
		startDate = new Date(endDate);
		dateToInput('#start-date', startDate);
		timeToInput('#start-time', startDate);
	}
	calendarDisplay();
});

$('#end-time').change(function (e) {
	inputToTime(this, endDate);
	// 시작 날짜가 종료 날짜보다 크면 시작 날짜 자동 조정
	if (startDate > endDate) {
		startDate = new Date(endDate);
		dateToInput('#start-date', startDate);
		timeToInput('#start-time', startDate);
	}
	calendarDisplay();
});
// ---- 이벤트 등록 : 날짜 및 시간 등록 End ----

// ---- 이벤트 등록 : 하루 종일 체크 ----
$('#allday-check').change(function(e) {
	isAllDay = $(this).is(':checked')
	$('#end-date').attr('disabled', isAllDay);
	$('#end-time').attr('disabled', isAllDay);
	if(isAllDay) {
		allDaySync();
	}
})
// ---- 이벤트 등록 : 하루 종일 체크 End----

// ---- 이벤트 등록 : 카테고리 선택 ----
$('#category-select').change(function(e){
	choosedCategory = categoryList[$(this).val()];
	$('#category-circle').css('background-color', choosedCategory.color);
}) 
// ---- 이벤트 등록 : 카테고리 선택 End ----

// ---- 이벤트 등록 : 장소 검색 ----
let timer;
$('#search-container > input').on('input', function(e){
	clearTimeout(timer);
	timer = setTimeout(async () => {
		// ul 태그 비우기
		$('#search-list').empty();  
		// 카카오맵 장소검색 
		const ps = new kakao.maps.services.Places(); 
		ps.keywordSearch($(this).val(), (data, status, pagination) => {
			placeList = [];
			if (status === kakao.maps.services.Status.OK) placeList = data;
			$.each(placeList, function (index, val) { 
				const li = $(`<li id=${index}><p>${val.place_name}</p><p>${val.address_name}</p></li>`)
				// 장소 선택 이벤트 추가
				$(li).click(function(e) {
					choosedPlace = placeList[$(this).attr('id')];
					$('#search-container > input').val(choosedPlace.place_name)
					$('#search-list-container').css('display', 'none')
				})
				$('#search-list').append(li)
			});
		})
		// 장소 목록 표시
		$('#search-list-container').css('display', 'block');
	}, 700);
})
// ---- 이벤트 등록 : 장소 검색 End----

// ---- 이벤트 등록 : 장소 선택 스크롤 숨기기 ----
$('#search-container').click(function(event){
	event.stopPropagation();
});

$(document).click(function(){
	$('#search-list-container').css('display', 'none')
});
// ---- 이벤트 등록 : 장소 선택 스크롤 숨기기 End----

// ---- 이벤트 등록 : 일정 등록하기 ----
$('#save-btn').click(function(e) {
	// 이름 검증
	const name = $('#name-container > input').val();
	if (name === '') {
		$('#name-container > input').addClass('is-invalid');
		$('#name-container > input').focus();
		return;
	}
	// 보낼 데이터 선언
	const data = {
		"name": name,
		"description": $('#description-container > textarea').val(),
		"scheduleCategoryId": choosedCategory.scheduleCategoryId,
		"startDate": `${$('#start-date').val()} ${$('#start-time').val()}`,
		"endDate": `${$('#end-date').val()} ${$('#end-time').val()}`,
		"placeName": choosedPlace.place_name,
		"placeLatitude": choosedPlace.y,
		"placeLongitude": choosedPlace.x
	}
	// api 요청
	$.ajax({
		type: "POST",
		url: '/api/schedule/personal',
		dataType: "json",
		contentType: "application/json",
		data: JSON.stringify(data),
		success: function (response) {
			if (!response.isSuccess) {
				// 예외 처리
			} 
			// 일정 생성 성공
			$('.top-container').css('display', 'none');
			Swal.fire({
				title: '일정 생성이 완료되었습니다',
				icon: 'success',
				confirmButtonColor: '#4fd1c5',
				confirmButtonText: '완료',
			}).then((result) => {
				if(result.isConfirmed) window.location.href = '/';
			});
		},
	});
})
// ---- 이벤트 등록 : 일정 등록하기 End----
// 이벤트 등록 End


// 시작 이벤트
// ---- 디폴트 일정 날짜 등록 ----
startDate.setHours(startDate.getHours() + 1); // 시작 시간은 현재 + 1시간
dateToInput('#start-date', startDate);
timeToInput('#start-time', startDate);
endDate.setHours(endDate.getHours() + 2);  // 종료 시간은 현재 + 1시간
dateToInput('#end-date', endDate);
timeToInput('#end-time', endDate);
// ---- 디폴트 일정 날짜 등록 End ----

// ---- 카테고리 db에서 불러오기
$.ajax({
	type: "GET",
	dataType : 'json',
	contentType: 'application/json',
	url: "/api/schedule/category",
	success: function (response) {
		if(!response.isSuccess) {
			// 예외 처리
		}
		// 카테고리 select 태그에 집어 넣기
		categoryList = response.data;
		$.each(categoryList, function (idx, category) {
			const opt = $('<option></option>');
			opt.attr('value', idx);
			opt.text(category.categoryName);
			$('#category-select').append(opt);
		});
		// 디폴트 카테고리로 설정
		choosedCategory = categoryList[$('#category-select').val()];
		$('#category-circle').css('background-color', choosedCategory.color);
	}
});
//

calendarDisplay();