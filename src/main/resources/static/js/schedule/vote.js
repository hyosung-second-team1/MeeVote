import {displayMap, createMarker, searchPlace, locFromAddress, addrFromLoc,  createOverlay, createPolyline} from '/js/module/map.js'
import * as aj from '/js/module/ajax.js'
import {showPlaceList} from '/js/module/common.js'
import {getRoute, getMultiRoutes} from '/js/module/mobility.js'

// 변수
// ---- 스케쥴 관련 정보
const urlSearch = new URLSearchParams(location.search);
let scheduleId = await urlSearch.get('scheduleId');
let scheduleInfo = await aj.getVotingDetail(scheduleId);
// ---- 사용자 정보 ----
const myInfo = await aj.getMyInfo();
let myScheduleInfo = scheduleInfo.memberList.find(v => v.email === myInfo.email)
let myPoint = myScheduleInfo.lat? [myScheduleInfo.lat, myScheduleInfo.lng] : await locFromAddress(myInfo.address);
// ---- 지도 객체 ----
const map = await displayMap('.map-container', myPoint[0], myPoint[1]);
// ---- 검색 위치 정보 ----
let list = [];
// ---- 마커 ----
let myMarker;
let searchMarker = [];
// ---- 오버레이 ----
let overlayArr = [];
let nowOverlay;
// ---- 투표 항목 ----
let voteItems = {};
// ---- 맴버 검색 ----
let memberList = {};
let isMemberChanged = true;
// 변수 End




// 1. 맴버 불러오기
// ---- 함수 : 맴버 ui 추가----
function createMemberUI(info) {
  const li = $(`
  <li class="search-item">
    <div class="member-image"> 
      <img src=${info.imgSrc} alt="">
    </div>
    <p class="member-info">${info.name}</p>
  </li>
  `)

  $('.member-list').append(li);
  return li;
}
// ---- 함수 : 맴버 ui 추가 ----

// ---- 함수 : 맴버 마커 추가----
async function createMemberMarker(info) {
  const startPoint = info.lat? [info.lat, info.lng] : await locFromAddress(info.address);
  let imgSrc = info.email === myInfo.email? 'my' : 'member';
  const marker = createMarker(map, startPoint[0], startPoint[1], 72, `/image/marker/${imgSrc}.png`);
  return marker;
}
// ---- 함수 : 맴버 마커 추가 End----


// --- 함수 : 맴버 목록 갱신 ----
async function resetMemberAll() {

  $.each(scheduleInfo.memberList, async function (index, info) {
    if (memberList.hasOwnProperty(info.email)) return;
    const ui = createMemberUI(info);
    const marker = await createMemberMarker(info);
    ui.click(async function(e) {
      map.panTo(new kakao.maps.LatLng(marker.getPosition().Ma, marker.getPosition().La));    
    })
  
    memberList[info.email] = {"ui": ui, "marker" : marker, "info":info};
  
    // 내 마커면 드래그앤드랍 이벤트 넣기
    if (info.email === myInfo.email) {
      myMarker = marker
      myMarker.setDraggable(true);
      kakao.maps.event.addListener(myMarker, 'dragend', function(e) {
        moveStart(myMarker.getPosition().Ma, myMarker.getPosition().La, "마커 이동");
      });
    }
  });
}
// --- 함수 : 맴버 목록 갱신 End----

// ---- 이벤트 등록 : 맴버 관리 이벤트 ----
$('.member-btn').click(function(e) {
  $('.member-container').toggleClass('hide-container');
})
// ---- 이벤트 등록 : 맴버 관리 이벤트 ----

// ---- 시작 이벤트 : 참여자 ui 생성 ----
resetMemberAll();
// ---- 시작 이벤트 : 참여자 ui 생성 End----

// 1. 맴버 불러오기 End



// 2. 장소 검색
// ---- 함수 : 오버레이 요소 생성 함수 ----
function createOverlayElement(place) {
  // 생성
  const container = $('<div>').addClass('search-info-container');
  const name = $('<p>').addClass('name');
  const nameLink = $('<a>').attr('href', place.place_url).text(place.place_name);
  const closeIcon = $('<i>').addClass('bi bi-x-circle');
  const category = $('<p>').text(place.category_name).addClass('category');
  const address = $('<p>').addClass('address');
  const addressSpan1 = $('<span>').text(place.address_name);
  const addressSpan2 = $('<span>').text(place.road_address_name);
  const buttons = $('<div>').addClass('buttons');
  const crosshairIcon = $('<i>').addClass('bi bi-crosshair2');
  const addButton = $('<button>').addClass('add-btn').text('추가');
  // 조합
  name.append(nameLink, closeIcon);
  address.append(addressSpan1, '/', addressSpan2);
  buttons.append(crosshairIcon, addButton);
  container.append(name, category, address, buttons);
  // 이벤트 추가
  closeIcon.click((e) => nowOverlay.setMap(null));
  addButton.click(async function(e) {
    const placeInfo = {
      "placeName": place.place_name,
      "lat": place.y,
      "lng": place.x
    }
    nowOverlay.setMap(null);
    const response = await aj.postVotingItem(scheduleId, placeInfo);
    Swal.fire({
      title: response.message,
      icon: response.isSuccess? 'success' : 'info',
      showConfirmButton: false
    });
    // 성공시 투표 항목 초기화

    if(response.isSuccess) resetVoteAll(false, false);
  })
  crosshairIcon.click(function(e) {
    moveStart(place.y, place.x, place.address_name)
  }) 
  return container;
}
// ---- 함수 : 오버레이 요소 생성 함수 End----


// ---- 함수 : 검색 마커와 리스트 클릭 이벤트 ----
function searchClickEvent(idx) {
  // 해당 위치로 이동
  const moveLatLon = new kakao.maps.LatLng(list[idx].y, list[idx].x);
  map.panTo(moveLatLon);
  // 오버레이 표시
  if(nowOverlay !== undefined) nowOverlay.setMap(null);
  nowOverlay = overlayArr[idx];
  nowOverlay.setMap(map);
}
// ---- 함수 : 검색 마커와 리스트 클릭 이벤트 End ----


// ---- 함수 : 장소 검색 후 리스트와 마커 표시 ----
async function serachTotal() {
  // 이전 마커 제거
  $.each(searchMarker, (idx, marker) => marker.setMap(null));
  list = [];
  searchMarker = [];
  overlayArr = [];
  // 장소 검색
  list = await searchPlace($('.place-search > input').val());
  showPlaceList(list, '.search-list-container', '.search-list')
  // 마커, 오버레이 추가
  $.each(list, function(idx, place) {
    const content = createOverlayElement(place).get(0);
    const marker = createMarker(map, place.y, place.x, 72);
    const overlay = createOverlay(map, marker, content);
    // 마커, 오버레이 배열에 넣기
    searchMarker.push(marker);
    overlayArr.push(overlay);
    // 마커에 이벤트 추가
    kakao.maps.event.addListener(marker, 'click', function() {
      searchClickEvent(idx)
    });
  });
  // 검색 리스트에 이벤트 추가하기
  $.each($('.search-list').children(), function (idx, li) { 
    $(li).click(function (e) { 
      searchClickEvent(idx)
    });
  });
}
// ---- 함수 : 장소 검색 후 리스트와 마커 표시 End ----

// ---- 이벤트 등록 : 장소 검색 ----
$('.place-search > i').click(() => serachTotal())

$('.place-search > input').keypress(async function (e) {
  if(e.keyCode && e.keyCode == 13){
    serachTotal();
  }
})
// ---- 이벤트 등록 : 장소 검색 End----

// ---- 이벤트 등록 : 장소 검색어 변화 감지 -----
$('.place-search > input').on('input',function (e) { 
  // 이전 마커 제거
  $.each(searchMarker, (idx, marker) => marker.setMap(null));
  searchMarker = [];
  $('.search-list').empty();
  // 오버레이 끄기
  if(nowOverlay !== undefined) nowOverlay.setMap(null);
})
// ---- 이벤트 등록 : 장소 검색어 변화 감지 -----


// ---- 이벤트 등록 : 장소 선택 스크롤 컨트롤 ----
$('.search-container').click(function(event){
	event.stopPropagation();
});

$(document).click(function(){
	$('.search-list-container').css('display', 'none');
});

$('.place-search > input').click(function (e) { 
  $('.search-list-container').css('display', 'block');
})
// ---- 이벤트 등록 : 장소 선택 스크롤 컨트롤 End----
// 2. 장소 검색 End


// 3. 투표 항목
// ---- 함수 : 투표 항목 정보 불러오기 ----
async function getVoteItemData(id, voteItem) {
  // 경로 정보 받아오기
  const origin = `${myPoint[1]},${myPoint[0]}`
  const destination = `${voteItem.lng},${voteItem.lat}`
  const routeInfo = await getRoute(origin, destination);
  const addr = await addrFromLoc(voteItem.lat, voteItem.lng);
  // 객체로 저장
  const voteItemInfo = {"vote": voteItem}
  voteItemInfo.sections = routeInfo.routes[0].sections[0];
  voteItemInfo.summary = routeInfo.routes[0].summary;
  voteItemInfo.address = addr;
  // 전역 변수에 저장

  return voteItemInfo
}
// ---- 함수 : 투표 항목 정보 불러오기 ----

// ---- 함수 : 투표 항목 ui 생성 함수 ----
function createVoteItemUI(id) {
  const voteItemInfo = voteItems[id];
  const placeName = voteItemInfo.vote.placeName;
  const taxiTime = parseInt((voteItemInfo.summary.duration) / 60);
  const taxiFee = voteItemInfo.summary.fare.taxi;
  const walkTime = parseInt((voteItemInfo.summary.distance) / 65);
  const count = voteItemInfo.vote.votedCount;
  const totalDistance = parseInt((voteItemInfo.summary.distance) / 1000);
  // ui 구성하기
  const li = $(
    `<li class="vote-item ${voteItemInfo.vote.didRequesterVoteHere? "choosed" : ""}" id=${id}>
      <div class="row-container vote-head">
        <p class="name">${placeName}</p>
        <i class="bi bi-check-circle-fill"></i>
      </div>
      <p class="address">${voteItemInfo.address[0].address.address_name}</p>
      <div class="row-container transporter-container">
        <div class="transporter">
          <img src="/image/icon/taxi.png" alt="">
          <span>${taxiTime}분</span>
        </div>
        <div class="transporter">
          <img src="/image/icon/walk.png" alt="">
          <span>${walkTime}분</span>
        </div>
        <div class="transporter">
          <img src="/image/icon/member.webp" alt="">
          <span class="vote-count">${count}명</span>
        </div>
      </div>
      <div class="row-container fee">
        <span>택시 : ${taxiFee}원</span>
        <span>${totalDistance}km</span>
      </div>
    </li>`
  );
  // 투표하기 이벤트 추가
  li.find('.vote-head > i').click(async function(e) {
    const result = await aj.doVote(id);
    if(result.isSuccess) {
      voteItems[id].vote.didRequesterVoteHere = !voteItems[id].vote.didRequesterVoteHere;
      voteItems[id].vote.votedCount = voteItems[id].vote.didRequesterVoteHere? 
      voteItems[id].vote.votedCount + 1 : voteItems[id].vote.votedCount - 1;
      li.toggleClass('choosed');
      li.find('.vote-count').text(voteItems[id].vote.votedCount + "명");
    }
  });
  // 마커로 이동하기 이벤트 추가
  li.click(async function(e) {
    map.panTo(new kakao.maps.LatLng(voteItemInfo.vote.lat, voteItemInfo.vote.lng));    
  })

  $('.vote-list').append(li);

  return li;
}
// ---- 함수 : 투표 항목 ui 생성 함수 End----

// ---- 함수 : 투표 항목 폴리라인 생성 함수 ----
async function createVoteItemPoly(id) {
  const cordArr = [];
  const roads = voteItems[id].sections.roads;
  
  $.each(roads, function (index, road) {
    for (let i = 0; i < road.vertexes.length; i += 2) {
      cordArr.push(new kakao.maps.LatLng(road.vertexes[i+1], road.vertexes[i]));
    } 
  });

  const polyLine = createPolyline(map, cordArr);

  return polyLine; 
}
// ---- 함수 : 투표 항목 폴리라인 생성 함수 End ----

// ---- 함수 : 투표 항목 인포레이아웃 ----
async function createIW(id) {
  const infowindow = new kakao.maps.InfoWindow({
    position : voteItems[id].marker.getPosition(), 
    content : `<div class="iw">${voteItems[id].vote.placeName}</div>`
  });
  
  infowindow.open(map, voteItems[id].marker); 

  return infowindow; 
}
// ---- 함수 : 투표 항목 인포레이아웃 생성 함수 End ----

// --- 함수 : 후보지와 맴버들간 거리 계산
async function getMemberRoutes(id) {
  const origins = [];
  $.each(memberList, function (idx, member) { 
    const origin = {
      'x': member.marker.getPosition().La,
      'y': member.marker.getPosition().Ma,
      'key': idx
    }
    origins.push(origin);
  });
  const destination = {
    'name' : 'a',
    'x': voteItems[id].summary.destination.x,
    'y': voteItems[id].summary.destination.y,
  }

  const multieRoute = await getMultiRoutes(origins, destination);
  
  return multieRoute;
}
// --- 함수 : 후보지와 맴버들간 거리 계산


// --- 함수 : 투표 항목 전부 갱신 ----
async function resetVoteAll(myChange, memberChange) {
  scheduleInfo = await aj.getVotingDetail(scheduleId);
  $.each(scheduleInfo.placeToVoteList, async function (index, voteItem) {
    const id = voteItem.placeToVoteId;
    if (!voteItems.hasOwnProperty(id) || myChange) {
      // 객체 구성
      voteItems[id] = await getVoteItemData(id, voteItem);
      voteItems[id].ui = createVoteItemUI(id);
      voteItems[id].marker = await createMarker(map, voteItems[id].vote.lat, voteItems[id].vote.lng, 60, '/image/marker/target.png');
      voteItems[id].poly = await createVoteItemPoly(id);
    }
    // if (memberChange) {
    //   voteItems[id].multieRoute = await getMemberRoutes(id);
    // }
  });
}
// --- 함수 : 투표 항목 갱신 End----

// ---- 시작 이벤트 : 투표 항목 표시 ----
resetVoteAll(true, true);
// ---- 시작 이벤트 : 투표 항목 표시 End----
// 3. 투표 항목 End



// 4. 출발 위치 옮기기
// ---- 함수 : 출발 위치 옮기기 ----
async function moveStart(lat, lng, name) {
  const result = await Swal.fire({
    title: "출발지를 변경합니다.",
    text: "현재 마커가 위치한 곳으로 출발지를 변경합니다.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "4FD1C5",
    cancelButtonColor: "darkgray",
    confirmButtonText: "확인",
    cancelButtonText: "취소"
  })

  if (result.isConfirmed) {
    myPoint = [lat, lng];
    const data = {
      "placeName": name,
      "lat": lat,
      "lng": lng
    };
    const response = await aj.updateDeparture(scheduleId, data);
    // 투표 정보 초기화
    if (response.isSuccess) {
      for (const key in voteItems) {
        voteItems[key].poly.setMap(null);
        voteItems[key].marker.setMap(null);
        voteItems[key].ui.remove();
      }
      resetVoteAll(true, false);
    }
  }

  myMarker.setPosition(new kakao.maps.LatLng(myPoint[0], myPoint[1]));
}
// ---- 함수 : 출발 위치 옮기기 End ----
// 4. 출발 위치 옮기기 End



// 5. 맴버 검색
// ---- 함수 : 맴버 검색 함수 ----
async function memberSearch(e){
  // ul 태그 비우기
  $('#search-list').empty();  
  // 검색 리스트 구성
  const response = await aj.serachMember({name: $('#name-serach > input').val()});
  const searchList = response.data

  $.each(searchList, function (idx, member) { 
    if (memberList.hasOwnProperty(member.email)) return;
    // 요소 생성
    let searchUI = $(`
      <li class="search-item">
        <div class="member-image"> 
          <img src=${member.imgSrc} alt="">
        </div>
        <p class="member-info">${member.name}</p>
      </li>
    `)
    // 맴버 추가 이벤트
    $(searchUI).click(async function(e) {
      const data = {
          "scheduleId": scheduleId,
          "inviteEmailList": [
            member.email
          ]
      };
      const response = await aj.inviteMember(data);
      scheduleInfo = await aj.getVotingDetail(scheduleId);
      isMemberChanged = true;
      await resetMemberAll();
      $(this).remove();
    })

    $('#search-list').append(searchUI);
  });

  // 검색 리스트 표시
  $('#search-list-container').css('display', 'block');
}
// ---- 함수 : 맴버 검색 이벤트 End ----

// ---- 이벤트 등록 : 회원 검색 ----
$('#name-serach > i').click(function(e){
  memberSearch();
})

$('#name-serach > input').keypress(function (e) { 
if(e.keyCode && e.keyCode == 13) memberSearch();
})
// ---- 이벤트 등록 : 회원 검색 End----

// ----  이벤트 등록 : 맴버 검색 창 닫기 ----
$('#search-container').click(function(e) {
  e.stopPropagation();
})

$(document).click(function(e) {
  $('#search-list-container').css('display', 'none');
})
// ----  이벤트 등록 : 맴버 검색 창 닫기 ----
// 5. 맴버 검색 End



// 6. 스케쥴 삭제
// ---- 이벤트 등록 : 스케쥴 삭제 혹은 나가기 ----
$('.del-btn').click(async function(e){
  const isOwner = scheduleInfo.isRequesterOwner
  const result = await Swal.fire({
    title: isOwner? '일정 삭제' : '일정 나가기',
    text: isOwner? 
      '한 번 삭제된 일정은 되돌릴 수 없습니다. 정말 삭제하시겠습니까?' : 
      '한 번 나가면 다시 초대받을 때까지 들어올 수 없습니다. 정말로 나가시겠습니까?',
    icon: 'warning',
    showConfirmButton: false,
    showDenyButton: true,
    showCancelButton: true,
    cancelButtonText: '아니오',
    denyButtonText: '네'
  });

  if (result.isDenied) {
    let response = isOwner? await aj.deleteSchedule(scheduleId) : await aj.outSchedule(scheduleId)
    if (response.isSuccess) {
      location.replace('/');
    }
  }
})
// ---- 이벤트 등록 : 스케쥴 삭제 혹은 나가기 End----
// 6. 스케쥴 삭제 End



// 7. 투표 종료하기
// ---- 이벤트 등록 : 투표 종료하기 -----
$('.end-btn').click(async function(e) {
  // 투표 종료 재차 확인
  const modalResult = await Swal.fire({
    title: "투표를 종료합니다.",
    text: "진행 중인 투표를 종료합니다.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#4FD1C5",
    cancelButtonColor: "darkgray",
    confirmButtonText: "확인",
    cancelButtonText: "취소"
  })

  if (modalResult.isConfirmed) {
      // 서버에 데이터 전송
    let placeId = 0;
    let maxCnt = -1;
    const votingStatus = await aj.getVotingDetail(scheduleId);
    $.each(votingStatus.placeToVoteList, function (idx, val) { 
      if (val.votedCount > maxCnt) {
        maxCnt = val.votedCount;
        placeId = val.placeToVoteId;
      }
    });
    const response = await aj.endVote(placeId);
    // 이동 모달 표시
    if (response.isSuccess) {
      const finalResult = await Swal.fire({
        title: "투표 종료 완료",
        text: "진행 중인 투표를 종료합니다.",
        icon: "success",
        confirmButtonColor: "#4FD1C5",
        confirmButtonText: "확인",
      });
      location.replace(`/schedule/detail?scheduleId=${scheduleId}`);
    }
  }
})
// ---- 이벤트 등록 : 투표 종료하기 End -----
// 7. 투표 종료하기 End



// ---- 시작 이벤트 : 정보 표시 ----
if (!scheduleInfo.isRequesterOwner) $('.end-btn').css('display', 'none');
$('.text-container > .name').text(scheduleInfo.votingScheduleInfo.name);
$('.text-container > .deadline').text(scheduleInfo.votingScheduleInfo.voteDeadline+"까지");






