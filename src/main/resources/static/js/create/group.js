import { getMyInfo } from '/js/module/ajax.js';

// 변수
// ---- 달력 관련 변수 ----
let date = new Date();
let year = date.getFullYear();
let month = date.getMonth();
// ---- 날짜 입력값 변수 ----
let isAllDay = false;
let startDate = new Date();
let endDate = new Date();
let voteDate = new Date();
// ---- 카테고리 변수 ----
let categoryList = [];
let choosedCategory;
// ---- 맴버 변수 ----
let myInfo = await getMyInfo();
let memberList = [];
let memberSearchList = [];


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

// ---- 함수 : 맴버 검색 ----
function memberSearch(e){
	$.ajax({
	type: "GET",
	url: '/api/member/search',
	dataType: "json",
	contentType: "application/json",
	data: {name: $('#name-serach > input').val()},
	success: function (response) {
		if(!response.isSuccess) {
			// 예외처리
			return;
		}
		// ul 태그 비우기
		$('#search-list').empty();  
		// 검색 리스트 구성
		memberSearchList = response.data;
		for (let index = 0; index < memberSearchList.length; index++) {
			const val = memberSearchList[index]
			// 이미 추가된 맴버는 표시 X
			if (memberList.includes(val.email)) continue;
			const li = $(`
			<li class="search-item" id=${index}>
				<div class="member-image"> 
					<img src=${val.imgSrc} alt="">
				</div>
				<div class="member-info">
					<p>${val.name}</p>
					<p>${val.email}</p>
				</div>
			</li>`
			)
			// 맴버 추가 이벤트
			$(li).click(function(e) {
				const choosedMember = memberSearchList[$(this).attr('id')];
				const memberEl = $(this).clone();
				// 삭제 버튼 추가
				const delBtn = $(`<i class="bi bi-person-x" id=${choosedMember.email}></i>`);
				delBtn.click(function(e) {
					memberList = memberList.filter(email => email !== choosedMember.email)
					memberEl.remove();
				});
				memberEl.append(delBtn);
				// 리스트 갱신
				memberList.push(choosedMember.email);
				$('.member-list').append(memberEl);
				$(this).remove();
			})
			$('#search-list').append(li)
		}
		// 검색 리스트 표시
		$('#search-list-container').css('display', 'block');
		}
	})
}
// ---- 함수 : 맴버 검색 End----
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
		endDate.setMinutes(endDate.getMinutes() + 1)
		dateToInput('#end-date', endDate);
		timeToInput('#end-time', endDate);
	}
  // 오늘 날짜 이후로 가능
	calendarDisplay();
});

$('#start-time').change(function (e) {
	inputToTime(this, startDate);
	// 시작 날짜 종료 날짜보다 크면 종료 날짜 자동 조정
	if (startDate > endDate) {
		endDate = new Date(startDate);
		endDate.setMinutes(endDate.getMinutes() + 1)
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
		startDate.setMinutes(startDate.getMinutes() - 1)
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
		startDate.setMinutes(startDate.getMinutes() - 1)
		dateToInput('#start-date', startDate);
		timeToInput('#start-time', startDate);
	}
	calendarDisplay();
});

$('#vote-date').change(function (e) {
	inputToDate(this, voteDate);
});

$('#vote-time').change(function (e) {
	inputToTime(this, voteDate);
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

// ---- 이벤트 등록 : 회원 검색 ----
$('#name-serach > i').click(function(e){
		memberSearch();
})

$('#name-serach > input').keypress(function (e) { 
  if(e.keyCode && e.keyCode == 13) memberSearch();
})
// ---- 이벤트 등록 : 회원 검색 End----

// ---- 이벤트 등록 : 맴버 선택 스크롤 숨기기 ----
$('#search-container').click(function(event){
	event.stopPropagation();
});

$(document).click(function(){
	$('#search-list-container').css('display', 'none')
});
// ---- 이벤트 등록 : 장소 선택 스크롤 숨기기 End----

// ---- 이벤트 등록 : 일정 등록하기 ----
$('#save-btn').click(function(e) {
  $('.input-warning').css('display','none');
	// 이름 검증
	const name = $('#name-container > input').val();
	if (name === '') {
		$('#name-container > input').addClass('is-invalid');
		$('#name-container > input').focus();
		return;
	}
  // 투표 마감일 검증
  const now = new Date();
  if (voteDate <= now) {
    $('#vote-date').focus();
    $('.input-warning').text('투표 마감일은 현재 날짜 이후여야 합니다.');
    $('.input-warning').css('display','block');
    return;
  }
  // 시작 날짜 검증
  if (startDate <= voteDate) {
    $('#start-date').focus();
    $('.input-warning').text('시작 날짜는 투표 마감일 이후여야 합니다.');
    $('.input-warning').css('display','block');
    return;
  }
	// 초대 회원 검증
	if (!memberList.length) {
		$('#name-serach > input').focus();
		$('.input-warning').text('함께할 회원을 초대해주세요!');
		$('.input-warning').css('display','block');
		return;
	}
	

	// 보낼 데이터 선언
	const data = {
		"name": name,
		"description": $('#description-container > textarea').val(),
		"scheduleCategoryId": choosedCategory.scheduleCategoryId,
		"startDate": `${$('#start-date').val()} ${$('#start-time').val()}`,
		"endDate": `${$('#end-date').val()} ${$('#end-time').val()}`,
		"inviteEmailList": memberList,
		"voteDeadline": `${$('#vote-date').val()} ${$('#vote-time').val()}`,
	}

	// api 요청
	$.ajax({
		type: "POST",
		url: '/api/schedule/group',
		dataType: "json",
		contentType: "application/json",
		data: JSON.stringify(data),
		success: function (response) {
			if (!response.isSuccess) {
				// 요청 실패 예외 처리
				console.log(response);
				return;
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
startDate.setDate(startDate.getDate() + 7); // 시작 시간은 현재 + 일주일
dateToInput('#start-date', startDate);
timeToInput('#start-time', startDate);
endDate.setDate(endDate.getDate() + 8);  // 종료 시간은 현재 + 일주일
dateToInput('#end-date', endDate);
timeToInput('#end-time', endDate);
voteDate.setDate(voteDate.getDate() + 3);  // 투표 마감 시간은 현재 + 3일
dateToInput('#vote-date', voteDate);
timeToInput('#vote-time', voteDate);
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

// 달력 표시
calendarDisplay();