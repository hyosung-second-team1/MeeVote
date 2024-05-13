// 내 정보 불러오기
export async function getMyInfo() {
  const response = await $.ajax({
    type: 'GET',
    url: '/api/member/me',
    dataType: 'json',
    contentType: 'application/json'
  });
  
  if (!response.isSuccess) {
    // 실패 시 예외 처리
  } 
  
  return response.data;
}


// 투표 상세 정보 불러오기
export async function getVotingDetail(scheduleID) {
  const response = await $.ajax({
    type: 'GET',
    url: '/api/voting/schedule/detail',
    dataType: 'json',
    contentType: 'application/json',
    data : {'scheduleId' : scheduleID}
  });
  
  if (!response.isSuccess) {
    // 실패 시 예외 처리
  }

  return response.data;
}


// 투표 항목 추가하기
export async function postVotingItem(scheduleID, placeInfo) {
  const response = await $.ajax({
    type: 'POST',
    url: `/api/voting/schedule/place?scheduleId=${scheduleID}`,
    dataType: 'json',
    contentType: 'application/json',
    data : JSON.stringify(placeInfo)
  });
  
  if (!response.isSuccess) {
    // 실패 시 예외 처리
  }

  return response;
}


// 투표하기
export async function doVote(placeToVoteId) {
  const response = await $.ajax({
    type: 'PUT',
    url: `/api/voting/schedule/place/toggle?placeToVoteId=${placeToVoteId}`,
    dataType: 'json',
    contentType: 'application/json',
    data : {'placeToVoteId': placeToVoteId}
  });
  
  if (!response.isSuccess) {
    // 실패 시 예외 처리
  }

  return response;
}


// 일정 삭제하기
export async function deleteSchedule(id) {
  const response = await $.ajax({
    type: 'DELETE',
    url: `/api/schedule/personal?scheduleId=${id}`,
    dataType: 'json',
    contentType: 'application/json',
  });
  
  if (!response.isSuccess) {
    // 실패 시 예외 처리
  }

  return response;
}


// 일정 나가기
export async function outSchedule(id) {
  const response = await $.ajax({
    type: 'DELETE',
    url: `/api/schedule/out?scheduleId=${id}`,
    dataType: 'json',
    contentType: 'application/json',
  });
  
  if (!response.isSuccess) {
    // 실패 시 예외 처리
  }

  return response;
}
