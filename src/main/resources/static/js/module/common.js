// ---- 장소 리스트 표시 ----
export function showPlaceList(list, container, ul){
  $(ul).empty();  
  $.each(list, function (index, val) { 
    const li = $(`<li id=${index}><p>${val.place_name}</p><p>${val.address_name}</p></li>`)
    $(ul).append(li)
  });
  $(container).css('display', 'block');
}
// ---- 장소 리스트 표시 End ----