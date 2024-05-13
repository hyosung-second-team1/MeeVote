
$("#alarmIcon").click(function () {
    let icon = $(this);
    let overlay = $(".overlay-container");

    // 아이콘의 클래스를 토글하여 색상을 변경합니다.
    icon.toggleClass("active-icon");

    // 오버레이를 표시하거나 숨깁니다.
    overlay.toggleClass("show-overlay");


});

// 데이터 배열
let cardData = [
    {
        title: "밥약이용",
        loc: "미정",
        category: "category2",
        startDate: "투표중",
        startTime: "투표중",
        voteEnd: "2024-05-11",
    },
    {
        title: "술약이용",
        loc: "미정",
        category: "category1",
        startDate: "투표중",
        startTime: "투표중",
        voteEnd: "2024-05-15",
    },
    {
        title: "시험공부",
        loc: "투표중",
        category: "category3",
        startDate: "2024-05-15",
        startTime: "12:30",
        voteEnd: "2024-05-15",
    },
    {
        title: "시험공부",
        loc: "혜화도서관",
        category: "category3",
        startDate: "2024-05-15",
        startTime: "17:30",
        voteEnd: "2024-05-15",
    },
    // 추가 데이터를 필요한 만큼 추가합니다.
];

let categoryColor = [
    {
        category1: "rgb(71, 147, 175)",
        category2: "rgb(255, 196, 112)",
        category3: "rgb(221, 87, 70)",
        category4: "rgb(139, 50, 44)",
    },
];


    let $msgOverlayListBubble = $(".msg-overlay-bubble-list");
    cardData.forEach(function (card) {
        let $cardOuter = $('<div class="card-outer"></div>');
        let $cardName = $('<div class="card-name"></div>');
        let $cardMain = $('<div class="card-main"></div>');
        let $cardMain1 = $('<div class="card-main-1"></div>');
        let $cardMain2 = $('<div class="card-main-2"></div>');
        let $cardMain3 = $('<div class="card-main-3"></div>');

        if (card.start === "투표중" && card.loc === "미정") {
            $cardName.append("새로운 투표가 등록되었습니다");
        } else if (card.loc === "투표중") {
            $cardName.append("장소 투표를 진행 중입니다.");
        } else if (
            (card.start != "투표중" && card.loc != "미정") ||
            (card.start != "투표중" && card.loc != "미정" && card.loc != "투표중")
        ) {
            $cardName.append("일정이 확정되었습니다.");
        }

        $cardMain1.append("<h3>" + card.title + "</h3>");
        $cardMain3.append(
            '<p><i class="bi bi-geo-alt"> </i>' + card.loc + "</p>"
        );
        // $cardMain1.append(
        //     '<p class="highlight-category ' +
        //     card.category +
        //     '">' +
        //     card.category +
        //     "</p>"
        // );

        $cardMain1.append(
            '<p class="highlight-category" style="background-color: ' +
            categoryColor[0][card.category] +  // 카테고리에 해당하는 색상을 가져옵니다.
            '; border-radius: 5px; padding: 3px;">' +
            card.category +
            "</p>"
        );

        $cardMain2.append(
            '<p><i class="bi bi-calendar-check"> </i>' + card.startDate + "</p>"
        );
        $cardMain2.append(
            '<p><i class="bi bi-clock"> </i>' + card.startTime + "</p>"
        );
        $cardMain3.append("<p>"+card.voteEnd + "투표 마감</p>");

        // $cardMain.css('border-color', categoryColor[card.category]);
        // let categoryBackgroundColor = categoryColor[card.category];
        // $cardMain1.append('<h3>' + card.title + '</h3>');
        $cardMain1.css("border-color", categoryColor);

        if (card.category == categoryColor.category1)

            $cardOuter.append($cardName);
        $cardOuter.append($cardMain);
        $cardMain.append($cardMain1);
        $cardMain.append($cardMain2);
        $cardMain.append($cardMain3);
        $msgOverlayListBubble.append($cardOuter);
    });

