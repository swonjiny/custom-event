### 전체 개요
이번 변경으로 다음이 가능해졌습니다.
- 헤더 메뉴에 “새창뛰우기1”, “새창뛰우기2”를 추가하여 각각 별도 브라우저 창을 엽니다.
- 메인 창의 Canvas 페이지에서 발생하는 상태와 선택 정보가 팝업 창에 실시간 전달됩니다.
- 팝업 창에 "Control Panel"을 추가하여 Canvas의 설정을 팝업에서도 동일하게 조정할 수 있고, 이 변경은 즉시 메인 Canvas 및 다른 팝업과 동기화됩니다.
- opener(메인) ↔ popup 간 초기 데이터 전달, 변경 통지, 추가 데이터 요청/응답, 상태 브로드캐스트가 모두 postMessage 및 CustomEvent를 통해 이뤄집니다.

구성 요소별 역할은 다음과 같습니다.
- src/components/Layout.jsx: 메뉴/레이아웃 + 창 열기 + 브릿지(메인 창에서 Canvas CustomEvent를 수신하여 팝업들로 전달, 팝업의 제어 변경을 Canvas로 전달)
- src/routes/index.jsx: /popup 라우트 등록(팝업 전용 화면)
- src/pages/Canvas.jsx: Canvas 렌더링 및 사용자 상호작용 처리, 상태/선택 정보를 CustomEvent로 브로드캐스트
- src/pages/PopupWindow.jsx: 팝업 창 UI, opener와 postMessage로 통신, Canvas 상태 확인 및 제어 패널 제공

---

### 라우팅 변경: src/routes/index.jsx
- 새로운 라우트 추가
    - path: "/popup" → element: <PopupWindow />
    - 이 경로는 전역 레이아웃(AppLayout) 밖에서 렌더링되므로 팝업이 헤더/푸터 없이 깔끔히 표시됩니다.

---

### 레이아웃과 브릿지: src/components/Layout.jsx
1) 새창 열기
- openPopup(menuId): `/popup?menu=${menuId}`를 새로운 윈도우로 엽니다.
- childWindowsRef.current 배열에 열린 창 핸들을 보관합니다.
- 헤더 메뉴에 "새창뛰우기1", "새창뛰우기2" 항목을 추가하여 클릭 시 각각 openPopup(1), openPopup(2) 호출.

2) Canvas ↔ Popup 브릿지
- Canvas에서 디스패치하는 CustomEvent를 메인 창이 듣고, 등록된 모든 팝업 창으로 postMessage로 포워딩합니다.
    - window.addEventListener('canvasSelection', ...): Canvas 선택 이벤트(payload: 좌표, 캔버스 크기, 활성 영역, 설정 등) → 모든 팝업에 type: 'canvasSelection' 전송
    - window.addEventListener('canvasState', ...): Canvas 상태(payload: showCircles, circleCount, activeAreaSize, tooltipShape) → 모든 팝업에 type: 'canvasState' 전송하고 latestCanvasStateRef에 보관
- 팝업의 제어 변경(controlUpdate)을 수신하여 Canvas로 CustomEvent 전파 + 다른 팝업에도 최신 상태 재전송
    - window.addEventListener('message', handleControlUpdateFromPopup): type === 'controlUpdate'이면 window.dispatchEvent(new CustomEvent('applyCanvasControl', { detail }))으로 Canvas에 적용 지시 → latestCanvasStateRef 갱신 → 모든 팝업에 'canvasState' 브로드캐스트

3) opener ↔ popup 기본 핸드셰이크 및 데이터 교환
- window.addEventListener('message', handleMessage)에서 type별 처리:
    - 'ready': 팝업이 준비 완료를 알리면, opener는 해당 팝업에 'init' 메시지 전송(메뉴 ID, 메시지, 타임스탬프). 아울러 latestCanvasStateRef가 있으면 즉시 'canvasState'도 추가 전송.
    - 'update': 팝업에서 변경 내용 통지 시 안티디자인 message.success로 알림 표시.
    - 'requestData': 팝업의 추가 데이터 요청에 'dataResponse' 응답 전송.
    - 'closed': 팝업이 닫힘을 알리면 childWindowsRef에서 정리.
- beforeunload: 메인 창이 닫히기 전 모든 팝업을 닫아 정리.

---

### Canvas: src/pages/Canvas.jsx
1) 사용자 상호작용 → 선택 및 툴팁/활성 영역 관리
- 마우스 다운 시 클릭 좌표, 캔버스 크기, 현재 설정(원 표시 여부, 개수, 패널 가시성, tooltipShape)을 content로 구성합니다.
- 선택 위치를 기준으로 activeArea(활성 영역) 사각형을 생성합니다.
- 내부 커스텀 이벤트 'tooltip' 디스패치(로컬 UI용).
- 중요한 부분: 메인 창으로 전역 CustomEvent 'canvasSelection'을 디스패치하여 Layout 브릿지가 팝업들로 전달하도록 합니다. payload에는 content + activeArea가 포함됩니다.

2) Canvas 상태 브로드캐스트
- showCircles, circleCount, activeAreaSize, tooltipShape가 바뀔 때마다 window.dispatchEvent(new CustomEvent('canvasState', { detail }))로 메인 창에 알림 → Layout 브릿지 → 모든 팝업으로 postMessage.

3) 팝업 제어 적용 수신
- window.addEventListener('applyCanvasControl', handler): 팝업에서 온 제어 변경을 받아 setShowCircles, setCircleCount, setActiveAreaSize, setTooltipShape 등을 적용합니다.

4) UI 요약
- 좌측 Control Panel: Show Circles 토글, Circle Count 슬라이더, Active Area Size 슬라이더, Tooltip Shape 라디오 그룹
- 우측 Information 패널: 요약 정보
- 화면 상 툴팁/포인터/다이아몬드/클라우드 등 다양한 모양의 툴팁 렌더링
- Saved Settings 패널: Redux 연동으로 저장/불러오기 (이번 브릿지 변경과 별개 기존 기능)

---

### 팝업 창: src/pages/PopupWindow.jsx
1) 핸드셰이크 및 기본 통신
- 마운트 시 window.opener.postMessage({ type: 'ready' })로 준비 완료 알림.
- opener로부터 'init' 수신 시 초기 데이터 표시.
- "변경 내용 전송" 버튼: opener로 type: 'update' 전송.
- "데이터 요청" 버튼: opener로 type: 'requestData' 전송 → 'dataResponse' 수신 시 표시.
- 언마운트 시 'closed' 통지로 opener가 정리할 수 있게 함.

2) Canvas 상태/선택 수신 표시
- 'canvasState' 수신: setCanvasState로 상태를 표준 출력(JSON 뷰) + 로컬 미러링 스위치/슬라이더/라디오 값을 동기화.
- 'canvasSelection' 수신: 사용자가 Canvas에서 클릭해 만든 선택/활성 영역 정보를 표시.

3) 팝업 Control Panel → Canvas 제어
- Switch/Slider/Radio 변경 시 sendControlUpdate(partial) → opener로 type: 'controlUpdate' 전송.
- opener(Layout)가 이를 받아 CustomEvent('applyCanvasControl')로 Canvas에 적용시키고, latestCanvasStateRef 갱신 후 모든 팝업에 'canvasState' 재브로드캐스트하여 다중 팝업 간 동기화.

---

### 메시지/이벤트 타입 일람과 페이로드
postMessage (윈도우 간):
- popup → opener
    - 'ready': { url }
    - 'update': { menuId, text, at }
    - 'requestData': { menuId, need }
    - 'closed': { url }
    - 'controlUpdate': { showCircles, circleCount, activeAreaSize, tooltipShape, ...partial }
- opener → popup
    - 'init': { menuId, message, sentAt }
    - 'dataResponse': { menuId, providedAt, items: [{ id, value }, ...] }
    - 'canvasState': { showCircles, circleCount, activeAreaSize, tooltipShape }
    - 'canvasSelection': { position:{x,y}, canvasSize:{w,h}, settings:{...}, activeArea:{x,y,width,height} }

CustomEvent (메인 창 내부 전역):
- Canvas → Layout: 'canvasState', 'canvasSelection'
- Layout → Canvas: 'applyCanvasControl' (payload는 popup의 controlUpdate 내용)

---

### 데이터 흐름 정리
1) Canvas 상태 동기화
- Canvas 설정 변경 → window(CustomEvent 'canvasState') → Layout 브릿지 → 모든 팝업 postMessage('canvasState')

2) Canvas 선택(클릭) 정보 전달
- Canvas 클릭 → window(CustomEvent 'canvasSelection') → Layout 브릿지 → 모든 팝업 postMessage('canvasSelection')

3) 팝업에서 Canvas 제어
- 팝업 Control Panel 변경 → opener로 postMessage('controlUpdate') → Layout이 'applyCanvasControl' CustomEvent로 Canvas에 반영 → latestCanvasStateRef 갱신 후 모든 팝업에 postMessage('canvasState')로 재동기화

4) 초기/추가 데이터 교환
- 팝업이 열리면 'ready' → opener가 'init' 반환, latestCanvasState도 즉시 보내 동기화
- 팝업 'requestData' → opener 'dataResponse' 전송

---

### 보안/안정성 주의 사항
- 현재 개발 편의상 postMessage 대상 origin을 '*'로 설정했습니다. 운영 환경에서는 동일 출처 확인 또는 특정 origin으로 제한하세요.
- childWindowsRef 관리로 팝업 추적과 정리를 수행합니다. 사용자가 직접 팝업을 닫는 경우를 대비해 'closed' 메시지 외에도 주기적으로 창 유효성 검사를 추가할 수 있습니다.
- message 이벤트 핸들러에서 data 타입 검사를 수행하여 방어적으로 처리합니다.

---

### 테스트 방법
1) 앱 실행 후 상단 메뉴에서 Canvas로 이동.
2) 새창뛰우기1 클릭 → 팝업이 뜨고 "초기 데이터" 카드가 곧 채워짐. Canvas의 상태가 이미 존재한다면 "Canvas State" 카드에도 나타남.
3) Canvas 캔버스를 클릭 → 팝업의 "Canvas Selection" 카드에 선택 정보와 activeArea가 표시됨.
4) 팝업 Control Panel에서 스위치/슬라이더/라디오를 조작 → 메인 Canvas 렌더링이 변경되고, 두 번째 팝업(새창뛰우기2)을 추가로 열어도 동일한 상태가 동기화됨.
5) 팝업에서 "변경 내용 전송" → 메인 창 우상단에 수신 알림이 뜸.
6) 팝업에서 "데이터 요청" → 응답 카드에 items 배열이 표시됨.

---

### 확장 팁
- 상태 종류 추가: Canvas에서 payload에 새로운 속성을 추가하고, Layout 브릿지에서 그대로 전달, 팝업에서 수신 처리만 추가하면 쉽게 확장됩니다.
- 특정 팝업에만 보내기: 현재는 모든 childWindows에 브로드캐스트합니다. 필요 시 menuId/target 정보를 포함해 특정 윈도우만 필터링해서 postMessage 하도록 수정 가능합니다.
- 성능: canvasState 전송 빈도가 높다면 디바운스를 걸어 postMessage 빈도를 줄일 수 있습니다.
- 타입 안정성: 메시지 payload에 대한 공통 타입(예: TypeScript 또는 JSDoc typedef)을 정의하면 유지보수가 쉬워집니다.

---

### 요약
- 헤더 메뉴 2개로 팝업을 띄우고, 메인 Canvas와 팝업 간 양방향 통신을 구축했습니다.
- Canvas의 상태/선택 → 팝업 실시간 표시, 팝업의 제어 변경 → Canvas 즉시 반영 및 모든 팝업 동기화.
- 확장과 테스트가 용이한 구조이며, 운영 시에는 postMessage origin 보안을 강화하면 됩니다.
