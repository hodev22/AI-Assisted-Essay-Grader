import React, { useState } from 'react';
import './Grading.css'; 

// --- [1] 자식 컴포넌트: 학생 1명분의 채점 영역 (GradingRow) ---
const GradingRow: React.FC<{ studentId: string }> = ({ studentId }) => {
  // 상태 관리
  const [expertScore, setExpertScore] = useState({ critical: '', math: '' });
  const [expertReason, setExpertReason] = useState(''); 
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  //점수 입력창 잠금 상태 (AI 확인 누르면 잠김)
  const [isScoreLocked, setIsScoreLocked] = useState(false);

  // 가짜 데이터
  const MOCK_PLAIN_TEXT = `원자력 발전은 적은 연료로 막대한 에너지를 생산할 수 있는 고효율 에너지원입니다. 화석 연료와 달리 발전 과정에서 온실가스를 거의 배출하지 않아 기후 변화 대응에 효과적입니다.
  그러나 방사능 폐기물 처리 문제가 심각합니다. 고위험 방사능 폐기물은 수십 년간 안전하게 보관해야 하는데, 아직 완벽한 영구 처분장이 마련된 국가는 드뭅니다. 
  
  또한 체르노빌이나 후쿠시마 사고처럼 한번의 사고가 돌이킬 수 없는 재앙을 초래할 수 있다는 안전성도 문제입니다. 최근의 원전 기술은 안정성이 대폭 향상되었다고는 하나, 자연재해나 인적 실수로 인한 사고 가능성을 완전히 배제할 수는 없습니다.

  따라서 원자력 발전은 탄소 중립을 위한 과도기적 에너지원으로 활용하되, 장기적으로는 태양광, 풍력 등 신재생 에너지의 비중을 높여가야 한다고 생각합니다. 에너지 안보와 경제성 측면에서도 특정 에너지원에만 의존하는 것은 위험하며, 다양한 에너지 믹스를 구성하는 것이 중요합니다.
  
  (이 부분은 텍스트가 길어졌을 때 스크롤이 생기는지 확인하기 위한 더미 텍스트입니다. 답안이 길어지면 박스의 높이는 500px로 고정되고 내부에 스크롤바가 생성됩니다. 이를 통해 전체 화면 레이아웃이 깨지지 않고 깔끔하게 유지될 수 있습니다.)`;

  const MOCK_HIGHLIGHTED_HTML = `
    원자력 발전은 적은 연료로 막대한 에너지를 생산할 수 있는 고효율 에너지원입니다. 
    <span class="highlight-blue">화석 연료와 달리 발전 과정에서 온실가스를 거의 배출하지 않아 기후 변화 대응에 효과적입니다.</span>
    그러나 방사능 폐기물 처리 문제가 심각합니다. <span class="highlight-yellow">고위험 방사능 폐기물은 수십 년간 안전하게 보관해야 하는데, 아직 완벽한 영구 처분장이 마련된 국가는 드뭅니다.</span> 
    또한 체르노빌이나 후쿠시마 사고처럼 한번의 사고가 돌이킬 수 없는 재앙을 초래할 수 있다는 안전성도 문제입니다.
    <br/><br/>
    최근의 원전 기술은 안정성이 대폭 향상되었다고는 하나, 자연재해나 인적 실수로 인한 사고 가능성을 완전히 배제할 수는 없습니다.
    따라서 원자력 발전은 탄소 중립을 위한 과도기적 에너지원으로 활용하되, 장기적으로는 태양광, 풍력 등 신재생 에너지의 비중을 높여가야 한다고 생각합니다.
    <br/><br/>
    (AI 채점 결과 화면에서도 스크롤이 정상적으로 작동하는지 확인하기 위한 텍스트입니다.)
  `;

  // --- 핸들러 ---
  const handleCheckAiResult = () => {
    if (!expertScore.math || !expertScore.critical) {
        alert("전문가 채점 점수를 모두 입력해주세요!");
        return; 
    }
    // AI 확인 누르는 순간 입력창 잠금
    setIsScoreLocked(true);
    setIsAiPanelOpen(true); 
    setIsLoading(true);     

    setTimeout(() => {
        setIsLoading(false); 
    }, 1500); //1.5초 로딩
  };

  const handleSaveExpertScore = () => {
    if (window.confirm(`Student #${studentId} 점수를 확정하시겠습니까? (확정 후 수정 불가)`)) {
        setIsConfirmed(true); 
    }
  };

  const handleEditScore = () => {
    // 점수 수정 버튼 눌러야만 잠금 해제
    setIsScoreLocked(false); 
    //setIsConfirmed(false);
  };

  const isAnalysisComplete = isAiPanelOpen && !isLoading;

  return (
    <div className="grading-row fade-in">
        {/* 상단 제목 영역 (데스크탑용 / 모바일에선 CSS로 숨김 처리됨) */}
        <div className="row-header desktop-only">
            <h2>Student #{studentId} 답안</h2>
            <h2>전문가 채점</h2>
            {/* AI 패널이 열리기 전에는 타이틀 숨김 */}
            <div className="header-placeholder">
                {isAiPanelOpen && <h2>AI 채점</h2>}
            </div>
        </div>

        {/* 2. 본문 영역 */}
        <div className="row-body">
            
            {/* [왼쪽] 학생 답안 (CSS에서 flex: 3으로 넓어짐) */}
            <div className="column student-column">
                {/* [추가] 모바일용 타이틀 */}
                <h3 className="mobile-title">Student #{studentId} 답안</h3>
                <div className="student-card">
                    {isAnalysisComplete ? (
                        <p className="answer-text" dangerouslySetInnerHTML={{ __html: MOCK_HIGHLIGHTED_HTML }} />
                    ) : (
                        <p className="answer-text">{MOCK_PLAIN_TEXT}</p>
                    )}
                </div>
            </div>

            {/* [가운데] 전문가 채점 (CSS에서 flex: 1) */}
            <div className="column expert-column">
                {/* [추가] 모바일용 타이틀 */}
                <h3 className="mobile-title">전문가 채점</h3>
                <div className="grading-form-container">
                    <div className="score-row">
                        <span className="score-label label-blue">수과학적 사고</span>
                        <input 
                            type="number" 
                            className="score-input"
                            value={expertScore.math}
                            onChange={(e) => setExpertScore({...expertScore, math: e.target.value})}
                            // 잠금 상태(isScoreLocked)이거나 확정(isConfirmed)되면 비활성화
                            disabled={isScoreLocked || isConfirmed}
                        />
                    </div>
                    <div className="score-row">
                        <span className="score-label label-yellow">비판적 사고</span>
                        <input 
                            type="number" 
                            className="score-input"
                            value={expertScore.critical}
                            onChange={(e) => setExpertScore({...expertScore, critical: e.target.value})}
                            disabled={isScoreLocked || isConfirmed} // 잠금 상태(isScoreLocked)이거나 확정(isConfirmed)되면 비활성화
                        />
                    </div>

                    <textarea 
                        className="reason-box"
                        placeholder="채점 근거(선택):"
                        value={expertReason}
                        onChange={(e) => setExpertReason(e.target.value)}
                        disabled={isConfirmed} //점수 확정 누르고 나면 입력 불가
                    />

                    <div className="button-stack">
                        {/* 패널이 열려있거나(isAiPanelOpen) 점수 확정되면(isConfirmed) 비활성화됨 
                        */}
                        <button 
                            className="btn-ai-check" 
                            onClick={handleCheckAiResult}
                            disabled={isAiPanelOpen || isConfirmed}
                        >
                            AI 채점 결과 확인
                        </button>
                        
                        <div className="btn-row">
                            <button 
                                className="btn-edit" 
                                onClick={handleEditScore}
                                disabled={!isAnalysisComplete || isConfirmed} //수정 버튼은 분석 완료 후에만 활성화, 확정되면 비활성화
                            >
                                점수 수정
                            </button>
                            <button 
                                className="btn-save" 
                                onClick={handleSaveExpertScore}
                                disabled={!isAnalysisComplete || isConfirmed}
                            >
                                점수 확정
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* [오른쪽] AI 채점 */}
            <div className="column ai-column">
                {isAiPanelOpen ? (
                    <>
                    {/* 모바일용 타이틀 */}
                    <h3 className="mobile-title">AI 채점</h3>
                    {isLoading ? (
                        <div className="spinner-container">
                            <div className="loading-spinner"></div>
                            <span className="loading-text">AI가 답안을 채점 중...</span>
                        </div>
                    ) : (
                        <div className="ai-result-content fade-in">
                            <div className="score-row">
                                <span className="score-label label-blue">수과학적 사고</span>
                                <div className="score-display">5</div>
                            </div>
                            <div className="score-row">
                                <span className="score-label label-yellow">비판적 사고</span>
                                <div className="score-display">6</div>
                            </div>
                            
                            {/* AI 채점 근거 영역 */}
                            <div className="ai-feedback-container">
                                <p className="feedback-title">채점 근거:</p>
                                <ul className="feedback-list">
                                    <li>핵심 논점 파악 및 다양한 관점 제시</li>
                                    <li>에너지 효율 및 폐기물 문제 관련 기술</li>
                                    <li>근거 문장: 왼쪽 답안 하이라이트 참조</li>
                                </ul>
                            </div>
                        </div>
                    )}
                    </>
                ) : (
                    <div className="empty-placeholder"></div>
                )}
            </div>
        </div>
    </div>
  );
};


// --- [2] 부모 컴포넌트: GradingScreen ---
interface GradingProps {
  onLogout: () => void;
}

const GradingScreen: React.FC<GradingProps> = ({ onLogout }) => {
  const [searchText, setSearchText] = useState('');
  const [studentIds, setStudentIds] = useState<string[]>([]);

  const handleSearch = () => {
    if(!searchText.trim()) {
        alert("채점할 학생의 ID를 입력해 주세요");
        return;
    }
    let ids: string[] = [];
    if (searchText.includes('-')) {
        const [start, end] = searchText.split('-').map(Number);
        if (!isNaN(start) && !isNaN(end) && start <= end) {
            for (let i = start; i <= end; i++) ids.push(String(i));
        }
    } else if (searchText.includes(',')) {
        ids = searchText.split(',').map(s => s.trim()).filter(s => s);
    } else {
        ids = [searchText.trim()];
    }
    setStudentIds(ids);
  };

  return (
    <div className="grading-container">
       <header className="top-header">
          <div className="logo">AI-Assisted Essay Review</div>
          <button className="logout-btn" onClick={onLogout}>Logout</button>
       </header>

       <main className="main-content">
          <div className="search-section">
             <div className="search-bar-wrapper">
                <i className="fa-solid fa-magnifying-glass search-icon"></i>
                <input 
                   type="text" 
                   placeholder="학생 ID를 입력해 주세요 ( ex. 1-3 / 1, 3, 5 )" 
                   value={searchText}
                   onChange={(e) => setSearchText(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button className="search-btn" onClick={handleSearch}>Search</button>
             </div>
          </div>

          {studentIds.length === 0 ? (
            <div className="empty-state-container">
                <p className="empty-text">채점 대상 입력 시 이곳에 해당 학생의 답안과 채점 란이 나타납니다.</p>
            </div>
          ) : (
            <div className="grading-list">
                {studentIds.map((id) => (
                    <GradingRow key={id} studentId={id} />
                ))}
            </div>
          )}
       </main>
    </div>
  );
};

export default GradingScreen;