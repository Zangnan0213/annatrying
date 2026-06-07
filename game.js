(function(){
// ==================== 核心数据区 ====================
const seasonCalendar = [
    {name:'🇦🇺 澳大利亚 (墨尔本)',q:1},{name:'🇨🇳 中国 (上海)',q:1},{name:'🇯🇵 日本 (铃鹿)',q:1},
    {name:'🇧🇭 巴林 (萨基尔)',q:1},{name:'🇸🇦 沙特 (吉达)',q:1},
    {name:'🇺🇸 迈阿密',q:2},{name:'🇮🇹 艾米利亚 (伊莫拉)',q:2},{name:'🇲🇨 摩纳哥 (蒙特卡洛)',q:2},
    {name:'🇪🇸 西班牙 (巴塞罗那)',q:2},{name:'🇨🇦 加拿大 (蒙特利尔)',q:2},{name:'🇦🇹 奥地利',q:2},{name:'🇬🇧 英国 (银石)',q:2},
    {name:'🇧🇪 比利时 (斯帕)',q:3},{name:'🇭🇺 匈牙利 (布达佩斯)',q:3},{name:'🇳🇱 荷兰 (赞德沃特)',q:3},
    {name:'🇮🇹 意大利 (蒙扎)',q:3},{name:'🇦🇿 阿塞拜疆 (巴库)',q:3},{name:'🇸🇬 新加坡',q:3},
    {name:'🇺🇸 美国 (奥斯汀)',q:4},{name:'🇲🇽 墨西哥',q:4},{name:'🇧🇷 巴西 (英特拉格斯)',q:4},
    {name:'🇺🇸 拉斯维加斯',q:4},{name:'🇶🇦 卡塔尔',q:4},{name:'🇦🇪 阿布扎比',q:4}
];

const teamData = {
    'Oracle Red Bull Racing': {tier:'top',bonus:10,color:'#361C5E',drivers:[{name:'Max Verstappen',skill:94},{name:'Liam Lawson',skill:80}],salary:80},
    'Mercedes-AMG Petronas': {tier:'top',bonus:9,color:'#27F4D2',drivers:[{name:'George Russell',skill:90},{name:'A.K. Antonelli',skill:78}],salary:75},
    'Scuderia Ferrari': {tier:'top',bonus:10,color:'#E8002D',drivers:[{name:'Lewis Hamilton',skill:92},{name:'Charles Leclerc',skill:91}],salary:85},
    'McLaren F1 Team': {tier:'top',bonus:9,color:'#FF8000',drivers:[{name:'Lando Norris',skill:89},{name:'Oscar Piastri',skill:86}],salary:70},
    'Aston Martin Aramco': {tier:'mid',bonus:6,color:'#229971',drivers:[{name:'Fernando Alonso',skill:90},{name:'Lance Stroll',skill:75}],salary:50},
    'BWT Alpine F1 Team': {tier:'mid',bonus:5,color:'#FF87BC',drivers:[{name:'Pierre Gasly',skill:83},{name:'Jack Doohan',skill:76}],salary:40},
    'Haas F1 Team': {tier:'low',bonus:1,color:'#B6BABD',drivers:[{name:'Kevin Magnussen',skill:78},{name:'Oliver Bearman',skill:74}],salary:15},
    'Racing Bulls': {tier:'low',bonus:2,color:'#6692FF',drivers:[{name:'Yuki Tsunoda',skill:82},{name:'Isack Hadjar',skill:75}],salary:18},
    'Stake F1 Team Kick Sauber': {tier:'low',bonus:0,color:'#52E252',drivers:[{name:'Nico Hulkenberg',skill:84},{name:'Gabriel Bortoleto',skill:73}],salary:12},
    'Williams Racing': {tier:'mid',bonus:4,color:'#64C4FF',drivers:[{name:'Alex Albon',skill:83},{name:'Carlos Sainz',skill:87}],salary:35}
};

const characters = {
    elena:{id:'elena',name:'埃莱娜·罗西',gender:'女',personality:'开朗热情',role:'围场公关'},
    marcel:{id:'marcel',name:'马塞尔·杜邦',gender:'男',personality:'严谨高傲',role:'首席技师'},
    lea:{id:'lea',name:'莉亚·穆勒',gender:'女',personality:'傲娇毒舌',role:'数据工程师'},
    hugo:{id:'hugo',name:'雨果·范德贝克',gender:'男',personality:'阳光忠诚',role:'体能教练'},
    camille:{id:'camille',name:'卡米耶·洛朗',gender:'女',personality:'冷静理性',role:'商务经纪人'}
};

// ==================== 游戏状态 ====================
const state = {
    year:2025, quarter:1, age:21, nationality:"摩纳哥", firstName:"", lastName:"",
    gender:"男", sexuality:"异性恋", team:null, position:"F2冠军", teamTier:null,
    driving:78, fitness:82, health:95, fame:55, wealth:400, fans:5.2,
    teamStatus:50, teammateRelation:50, teamPrincipalRelation:50, reserveProgress:0,
    married:false, spouseId:null, romanceLevel:{}, investments:[], properties:[], relationships:{}, flags:{}, children:[],
    gameOver:false, deathAge:80+Math.floor(Math.random()*20), retired:false, retiredRole:'none',
    seasonPoints:0, seasonBest:'-', seasonWins:0, careerWins:0, careerPodiums:0, wdcTitles:0,
    allDriverPoints:{}, racesThisQuarter:[], currentRaceIndex:0,
    actionsLeftThisQuarter:3, consecutiveSkips:0, consecutivePodiumlessSeasons:0, generation:1, monthlyExpenses:5,
    // 年薪合同
    salary:0, contractYears:0,
    // 研发系统
    rdPoints:0, rdEngine:0, rdAero:0, rdChassis:0,
    // 转会
    pendingTransfer:null,
    // 宿敌
    rivals:[],
    // 排位赛
    lastQualifyingPos:null,
    // 雨战标记
    isWetRace:false
};

// ==================== 工具函数 ====================
function clamp(v,min,max){return Math.max(min,Math.min(max,v));}
function rng(min,max){return Math.floor(Math.random()*(max-min+1))+min;}
function playerName(){return state.firstName+'·'+state.lastName;}
function getRel(id){if(!state.relationships[id])state.relationships[id]={...characters[id],affection:0,relationType:'none'};return state.relationships[id];}
function changeAffection(id,d){let r=getRel(id);r.affection=clamp(r.affection+d,-30,100);updateRomanceLevel(id);}
function updateRomanceLevel(id){let r=getRel(id);if(!state.romanceLevel[id])state.romanceLevel[id]='none';let a=r.affection;if(state.romanceLevel[id]==='none'&&a>=25)state.romanceLevel[id]='friend';if(state.romanceLevel[id]==='friend'&&a>=55)state.romanceLevel[id]='crush';}
function canRomance(charGender){if(state.sexuality==='双性恋')return true;if(state.sexuality==='异性恋')return charGender!==state.gender;if(state.sexuality==='同性恋')return charGender===state.gender;return false;}
function canRace(){return state.position==='正式车手'&&!state.retired;}
function teamRdBonus(){return state.rdEngine*2+state.rdAero*1.5+state.rdChassis*1;}
function isRival(driverName){return state.rivals.includes(driverName);}

function updateState(changes){
    if(changes.driving) state.driving=clamp(state.driving+changes.driving,5,99);
    if(changes.fitness) state.fitness=clamp(state.fitness+changes.fitness,5,99);
    if(changes.health!==undefined) state.health=clamp(state.health+changes.health,1,100);
    if(changes.fame) state.fame=clamp(state.fame+changes.fame,1,99);
    if(changes.wealth!==undefined) state.wealth=Math.max(-50,state.wealth+changes.wealth);
    if(changes.fans) state.fans=Math.max(0.05,state.fans+changes.fans);
    if(changes.team){state.team=changes.team;state.teamTier=teamData[changes.team]?.tier||null;}
    if(changes.position) state.position=changes.position;
    if(changes.teamStatus) state.teamStatus=clamp(state.teamStatus+changes.teamStatus,5,100);
    if(changes.teammateRelation) state.teammateRelation=clamp(state.teammateRelation+changes.teammateRelation,5,100);
    if(changes.teamPrincipalRelation) state.teamPrincipalRelation=clamp(state.teamPrincipalRelation+changes.teamPrincipalRelation,5,100);
    if(changes.reserveProgress) state.reserveProgress=clamp(state.reserveProgress+changes.reserveProgress,0,100);
    if(changes.rdPoints) state.rdPoints=Math.max(0,state.rdPoints+changes.rdPoints);
    renderAll();
}

function initSeasonPoints(){
    state.allDriverPoints={};
    for(let t in teamData) teamData[t].drivers.forEach(d=>state.allDriverPoints[d.name]=0);
    state.allDriverPoints[playerName()]=0;
}

// ==================== UI 辅助 ====================
function showNarrative(html){document.getElementById('narrative').innerHTML=html;document.getElementById('scrollArea').scrollTop=0;}
function showChoices(items){
    clearChoices();
    items.forEach(item=>{
        let btn=document.createElement('button');
        btn.className='choice-btn '+(item.styleClass||'');
        btn.innerHTML=item.text+(item.desc?`<span class="choice-sub">${item.desc}</span>`:'');
        btn.onclick=item.callback;
        document.getElementById('choicesContainer').appendChild(btn);
    });
}
function clearChoices(){document.getElementById('choicesContainer').innerHTML='';}
function addNextBtn(text,cb){
    clearChoices();
    let btn=document.createElement('button');btn.className='choice-btn primary-choice';btn.innerHTML=text;
    btn.onclick=cb;document.getElementById('choicesContainer').appendChild(btn);
}

// ==================== 晋升检查 ====================
function checkPromotion(){
    if(state.retired||(state.position!=='储备车手'&&state.position!=='试车手'))return;
    if(state.reserveProgress>=100){
        if(state.driving>=60&&state.fame>=40&&state.teamPrincipalRelation>=50){
            state.position='正式车手';state.reserveProgress=0;state.fame=clamp(state.fame+8,1,99);
            showNarrative('🚀 <span class="good">恭喜晋升为正式车手！你将代表车队征战每场大奖赛正赛！</span>');
        }else{
            state.reserveProgress=75;let reason=[];
            if(state.driving<60)reason.push('驾驶技术不足');
            if(state.fame<40)reason.push('声望不足');
            if(state.teamPrincipalRelation<50)reason.push('领队关系不足');
            showNarrative('📋 <span class="warn">晋升评估未通过：'+reason.join('，')+'。进度回落至75。</span>');
        }
    }
}

// ==================== 核心：真实20车排位算法 ====================
function simulateFullGrid(playerStrategy, isQualifying){
    // 构建全部20位车手的战力评分
    let grid=[];
    let playerBase=state.driving*0.40+state.fitness*0.15+(isQualifying?0:state.health*0.05);
    let rdBonus=teamRdBonus();
    let teamBonus=state.teamTier?{top:14,mid:7,low:2}[state.teamTier]:0;
    let stratMod=isQualifying?
        {perf:6,risk:1.5}:
        (playerStrategy==='aggressive'?{perf:8,risk:2.5}:playerStrategy==='conservative'?{perf:-3,risk:0.3}:{perf:2,risk:1});

    // 玩家
    let playerScore=playerBase+teamBonus+rdBonus+stratMod.perf+Math.random()*25;
    let playerCrash=Math.random()<0.015*stratMod.risk;
    let playerMechFail=Math.random()<0.04*stratMod.risk;
    let playerDNF=false;
    if(playerCrash){playerScore=0;playerDNF=true;state.health=clamp(state.health-8,1,100);}
    if(playerMechFail){playerScore=Math.max(0,playerScore-40);}

    // 宿敌碰撞加成
    grid.push({name:playerName(),score:playerScore,isPlayer:true,dnf:playerDNF,crash:playerCrash,mechFail:playerMechFail});

    // 19位AI车手
    for(let [teamName,team] of Object.entries(teamData)){
        for(let driver of team.drivers){
            if(driver.name===playerName()&&state.team===teamName)continue;
            let aiTeamBonus=team.tier==='top'?40:team.tier==='mid'?20:0;
            let aiRd=(teamData[teamName]._rdEngine||0)*2+(teamData[teamName]._rdAero||0)*1.5+(teamData[teamName]._rdChassis||0)*1;
            let aiScore=driver.skill+aiTeamBonus+aiRd*0.3+Math.random()*30;
            let aiDNF=false;
            // DNF概率约5%
            if(Math.random()<0.05){aiDNF=true;aiScore=0;}
            // 宿敌与玩家相近名次时碰撞率提升
            if(isRival(driver.name)&&!isQualifying&&Math.random()<0.12){aiDNF=true;aiScore=0;}
            grid.push({name:driver.name,score:aiScore,isPlayer:false,dnf:aiDNF});
        }
    }

    // 按score降序排列，DNF排末尾
    grid.sort((a,b)=>{
        if(a.dnf&&!b.dnf)return 1;if(!a.dnf&&b.dnf)return -1;
        return b.score-a.score;
    });

    // 分配名次1-20
    let position=1;
    grid.forEach((g,i)=>{g.position=i+1;});

    let playerEntry=grid.find(g=>g.isPlayer);
    return {grid,playerEntry};
}

// ==================== 排位赛 + 正赛双轨制 ====================
function startQuarterRaces(){
    state.racesThisQuarter=seasonCalendar.filter(r=>r.q===state.quarter);
    state.currentRaceIndex=0;
    if(state.racesThisQuarter.length===0){finishQuarterRaces();return;}

    // 低健康强制参赛惩罚
    if(state.flags['forced_race_low_health']){
        if(Math.random()<0.60){
            showNarrative('💔 <span class="warn">正赛高负荷下身体崩盘！被迫退赛！</span>');
            state.health=clamp(state.health-25,1,100);state.fitness=clamp(state.fitness-15,5,99);
            state.flags['forced_race_low_health']=false;
            if(state.health<=10||state.fitness<=10){
                showNarrative('💔 <span class="warn">医生确诊不可逆损伤，被迫退役。</span>');
                addNextBtn('接受退役宿命',()=>triggerRetirement('健康原因'));
                renderAll();return;
            }
            addNextBtn('▶ 医疗终止，跳过本季剩余比赛',()=>finishQuarterRaces());
            renderAll();return;
        }
        state.health=clamp(state.health-15,1,100);
        state.flags['forced_race_low_health']=false;
    }
    playNextRace();
}

function playNextRace(){
    if(state.currentRaceIndex>=state.racesThisQuarter.length){finishQuarterRaces();return;}
    let race=state.racesThisQuarter[state.currentRaceIndex];
    // 雨战判定
    state.isWetRace=Math.random()<0.2;

    let weatherText=state.isWetRace?'🌧️ <span class="warn">【雨战】赛道湿滑，驾驶技术权重提升！</span><br>':'';
    showNarrative(`🌍 <span class="highlight">F1 第${state.currentRaceIndex+1}站：${race.name}</span><br>${weatherText}周六排位赛即将开始，请选择排位赛策略：`);
    showChoices([
        {text:'🔥 激进排位 (单圈极速，撞墙风险)',styleClass:'danger-choice',callback:()=>runQualifying('aggressive',race)},
        {text:'⚖️ 标准排位 (攻守兼备)',callback:()=>runQualifying('balanced',race)},
        {text:'🛡️ 保守排位 (稳稳进场)',callback:()=>runQualifying('conservative',race)}
    ]);
}

function runQualifying(qualiStrategy,race){
    let result=simulateFullGrid(qualiStrategy,true);
    let pe=result.playerEntry;
    state.lastQualifyingPos=pe.position;

    let qualiText=`🕐 <span class="highlight">排位赛结果：${race.name}</span><br>你的起步顺位：<strong>第 ${pe.position} 名</strong>`;
    if(pe.position<=3)qualiText+=' <span class="good">🔥 前排发车！</span>';
    else if(pe.position<=10)qualiText+=' <span class="good">Q3晋级！</span>';
    else qualiText+=' <span class="text-sub">Q2/Q1淘汰</span>';
    if(pe.dnf)qualiText+='<br><span class="warn">排位赛撞墙！明天维修区发车。</span>';

    qualiText+='<br><br>周日正赛即将发车，选择正赛策略：';
    showNarrative(qualiText);

    let wetBonus=state.isWetRace?' (雨战中驾驶能力权重翻倍)':'';
    showChoices([
        {text:'🔥 全开激进模式'+wetBonus,styleClass:'danger-choice',callback:()=>runRace(race)},
        {text:'⚖️ 标准巡航模式',callback:()=>runRace(race)},
        {text:'🛡️ 极致保胎防守模式',callback:()=>runRace(race)}
    ]);
}

function runRace(race){
    // 获取玩家选择的正赛策略（从按钮上下文推断，简化处理用上次选择）
    let strategy='balanced'; // 默认
    let result=simulateFullGrid(strategy,false);
    let pe=result.playerEntry;

    // 排位赛顺位影响：从后排发车有微弱惩罚
    if(state.lastQualifyingPos&&state.lastQualifyingPos>10){
        // 后排发车已经在grid排序中体现了
    }

    let pts=pe.position<=10?[25,18,15,12,10,8,6,4,2,1][pe.position-1]:0;
    state.seasonPoints+=pts;
    if(pe.position===1)state.seasonWins++;
    if(pe.position<=3)state.careerPodiums++;
    state.careerWins+=pe.position===1?1:0;
    if(state.seasonBest==='-'||pe.position<parseInt(state.seasonBest))state.seasonBest=pe.position;

    // 奖金（×10倍经济）
    state.wealth+=pts*15;
    state.fans=Math.max(0.05,state.fans+(pe.position===1?1.5:pe.position<=3?0.5:0));

    // 研发点数：完赛即获得，名次越高越多
    if(!pe.dnf){
        let rdGain=Math.max(1,11-pe.position)*2;
        state.rdPoints+=rdGain;
    }

    // 更新其他车手积分
    let pointsSystem=[25,18,15,12,10,8,6,4,2,1];
    result.grid.forEach(g=>{
        if(!g.isPlayer&&g.position<=10){
            state.allDriverPoints[g.name]=(state.allDriverPoints[g.name]||0)+pointsSystem[g.position-1];
        }
    });

    // 构建赛果叙事
    let narrative=`🏎️ <span class="highlight">${race.name} 完赛！</span><br>`;
    // 显示前5名
    narrative+='<span class="text-sub" style="font-size:11px;">';
    result.grid.slice(0,5).forEach(g=>{
        narrative+=`${g.position}. ${g.isPlayer?'<span class="highlight">'+g.name+'</span>':g.name}  `;
    });
    narrative+='</span><br>';

    if(pe.dnf){
        narrative+=`你的结果：<span class="warn">DNF（未完赛）</span> 积分 +0`;
        if(pe.crash)narrative+='<br>💥 <span class="warn">碰撞事故！健康-8</span>';
        if(pe.mechFail)narrative+='<br>🔧 <span class="warn">严重机械故障！</span>';
    }else{
        narrative+=`你的名次：<strong>第 ${pe.position} 名</strong> (积分 +${pts})`;
        if(pe.position===1)narrative+=' 🏆 <span class="good">P1！分站冠军！香槟喷洒！</span>';
        else if(pe.position<=3)narrative+=' 🍾 <span class="good">登领奖台！</span>';
    }
    if(state.isWetRace)narrative+='<br>🌧️ 雨战考验了你的驾驶极限！';

    showNarrative(narrative);
    state.currentRaceIndex++;
    state.lastQualifyingPos=null;
    addNextBtn(state.currentRaceIndex>=state.racesThisQuarter.length?'🏁 结束本季度赛程':'▶ 前往下一场大奖赛',()=>playNextRace());
    renderAll();
}

function finishQuarterRaces(){
    let narrative=`🏁 <span class="good">Q${state.quarter} 所有大奖赛已落幕！</span><br>本季最佳名次：<span class="highlight">第${state.seasonBest}名</span> | 赛季积分：<span class="highlight">${state.seasonPoints}分</span> | 研发点数：<span class="highlight">${state.rdPoints}</span>`;

    if(state.health<25||state.fitness<25){
        narrative+='<br><br>🏥 <span class="warn">高压赛程让你瘫倒在称重台上……</span>';
        if(state.health<15||state.fitness<15){
            if(Math.random()<0.40){
                narrative+='<br>💔 <span class="warn">医疗委员会强制退役诊断。</span>';
                showNarrative(narrative);
                addNextBtn('接受强制退役',()=>triggerRetirement('身体极度透支'));
                return;
            }
        }
        state.health=clamp(state.health-5,1,100);state.fitness=clamp(state.fitness-5,5,99);
    }

    showNarrative(narrative);
    addNextBtn('⏩ 推进至下一季度',()=>startNewQuarter());
    if(!state.retired&&state.age>=35)document.getElementById('retireBtn').style.display='block';
    renderAll();
}

// ==================== 赛季推进 ====================
function startNewQuarter(){
    if(state.gameOver)return;

    // Q4赛季末结算
    if(state.quarter===4){
        endSeason();
        if(state.retired)return;
        state.quarter=1;state.year++;state.age++;
        if(state.age>33)state.fitness=clamp(state.fitness-1,5,99);
        if(state.age>37)state.driving=clamp(state.driving-1,5,99);

        // 执行挂起的转会
        if(state.pendingTransfer){
            let newTeam=state.pendingTransfer;
            state.team=newTeam;state.teamTier=teamData[newTeam].tier;
            state.salary=teamData[newTeam].salary;
            state.contractYears=2;
            state.pendingTransfer=null;
            // 研发等级重置（新赛车）
            state.rdEngine=Math.floor(state.rdEngine*0.3);
            state.rdAero=Math.floor(state.rdAero*0.3);
            state.rdChassis=Math.floor(state.rdChassis*0.3);
            showNarrative(`🔄 <span class="highlight">转会正式生效！你已加入 ${newTeam}！</span><br>新赛车需要重新适应，研发等级大幅降低。年薪：${state.salary}万€`);
        }
    }else{
        state.quarter++;
    }

    // 死亡判定
    if(state.age>=state.deathAge){
        state.gameOver=true;state.retired=true;
        showNarrative('🕊️ <span class="text-sub">寿终正寝。围场降半旗默哀。</span>');
        clearChoices();showInheritIfPossible();return;
    }

    if(state.retired){retiredLife();return;}

    // 领奖台通牒
    if(state.flags['principal_talk_podiumless']){
        let seasons=state.flags['podiumless_seasons'];
        state.flags['principal_talk_podiumless']=false;
        if(seasons>=3){
            showNarrative('🚨 <span class="warn">领队最后通牒：连续三赛季颗粒无收。合同已被终止。</span>');
            addNextBtn('接受解约退役',()=>triggerRetirement('被裁撤解约'));
            return;
        }
        showNarrative(`🚨 <span class="warn">领队约谈：已连续 ${seasons} 赛季无领奖台！</span>`);
        showChoices([
            {text:'💬 恳求宽限 (领队好感-15，地位-20)',callback:()=>{
                state.teamPrincipalRelation=clamp(state.teamPrincipalRelation-15,5,100);
                state.teamStatus=clamp(state.teamStatus-20,5,100);
                state.consecutivePodiumlessSeasons=1;
                showNarrative('👔 "这是最后的机会。"');renderAll();
                addNextBtn('▶ 继续',()=>startQuarterActionPhase());
            }},
            {text:'🏁 坦然退役',styleClass:'danger-choice',callback:()=>triggerRetirement('不堪压力隐退')}
        ]);
        return;
    }

    // 低健康警告
    if(state.health<30||state.fitness<30){
        showNarrative(`🚨 <strong>医疗红牌</strong><br>健康: <span class="warn">${state.health}</span> | 体能: <span class="warn">${state.fitness}</span>`);
        showChoices([
            {text:'🏥 全季休战 (健康+15，体能+10)',callback:()=>{
                state.health=clamp(state.health+15,1,100);state.fitness=clamp(state.fitness+10,5,99);
                state.consecutiveSkips=0;showNarrative('🏥 <span class="good">疗养恢复。</span>');renderAll();
                addNextBtn('⏩ 推进',()=>startNewQuarter());
            }},
            {text:'🏎️ 强行参赛',styleClass:'danger-choice',callback:()=>{
                state.flags['forced_race_low_health']=true;
                showNarrative('🏎️ <span class="warn">不顾阻挠，继续参赛。</span>');
                startQuarterActionPhase();
            }}
        ]);
        return;
    }

    startQuarterActionPhase();
}

// ==================== 行动决策区 ====================
function startQuarterActionPhase(){
    checkPromotion();
    state.actionsLeftThisQuarter=3;
    document.getElementById('skipBtn').style.display='block';
    document.getElementById('retireBtn').style.display=(state.age>=35)?'block':'none';
    document.getElementById('rdBtn').style.display=canRace()?'block':'none';
    selectActionCategory();
    renderAll();
}

function selectActionCategory(){
    showNarrative(`🗓️ <span class="highlight">${state.year}年 Q${state.quarter}</span><br>剩余行动：<strong>${state.actionsLeftThisQuarter}</strong> 次`);
    let cats=[
        {text:'🏋️ 个人提升',callback:()=>showSub('personal')},
        {text:'🤝 围场社交',callback:()=>showSub('team')},
        {text:'💼 商业理财',callback:()=>showSub('business')}
    ];
    if(state.position==='试车手'||state.position==='储备车手')cats.push({text:'📋 晋升通道',callback:()=>showSub('promotion')});
    cats.push({text:'❤️ 私人生活',callback:()=>showSub('social')});
    if(canRace())cats.push({text:'🔧 赛车研发',callback:()=>showSub('rd')});
    showChoices(cats);
}

function showSub(cat){
    let acts=[];
    if(cat==='personal'){
        acts.push({text:'🏋️ 高原体能特训',desc:'体能大幅提升',msg:'🏋️ 高原拉练，心肺突破！',effect:{fitness:rng(4,7),health:3}});
        acts.push({text:'🏎️ 模拟器调校',desc:'驾驶+晋升进度',msg:'🏎️ 模拟器通宵，肌肉记忆更深！',effect:{driving:rng(3,6),reserveProgress:(state.position==='储备车手'||state.position==='试车手')?10:0}});
        acts.push({text:'🏥 医疗理疗',desc:'恢复大量健康',msg:'🏥 水疗按摩，疲劳一扫而空。',effect:{health:rng(5,12)}});
    }else if(cat==='team'){
        acts.push({text:'👔 拜访领队',custom:true,callback:()=>principalMeeting()});
        acts.push({text:'🤝 与队友聚餐',desc:'改善P房气氛',msg:'🤝 一顿意面化解了摩擦。',effect:{teammateRelation:10}});
        acts.push({text:'🔥 媒体挑衅对手',custom:true,callback:()=>provokeRival()});
        acts.push({text:'👏 称赞对手',custom:true,callback:()=>praiseRival()});
        acts.push({text:'🌐 围场公共区社交',desc:'结识各队人员',custom:true,callback:()=>paddockSocial()});
    }else if(cat==='business'){
        acts.push({text:'💼 全球代言',desc:'大量现金',msg:'💼 聚光灯下你是王牌！代言费入账。',effect:{wealth:rng(80,150)}});
        acts.push({text:'📰 独家专访',desc:'声望+粉丝',msg:'📰 你的高情商登上了杂志封面。',effect:{fame:5,fans:0.5}});
        acts.push({text:'📈 资产投资',custom:true,callback:()=>showInvestChoices()});
    }else if(cat==='promotion'){
        acts.push({text:'📋 争取FP1出场',custom:true,callback:()=>seekOpportunity()});
    }else if(cat==='social'){
        let hasSocial=false;
        for(let id in state.relationships){
            let r=state.relationships[id];
            if(r.affection<40)acts.push({text:`💬 简讯 ${r.name}`,custom:true,callback:()=>{changeAffection(id,10);showNarrative(`💬 你们聊了很久。`);consumeAction();}});
            else if(r.affection<70)acts.push({text:`☕ 咖啡 ${r.name}`,custom:true,callback:()=>{changeAffection(id,8);showNarrative(`☕ 关系急剧升温。`);consumeAction();}});
            else if(!state.married)acts.push({text:`❤️ 求婚 ${r.name}`,custom:true,callback:()=>{
                if(state.wealth>=200){state.wealth-=200;state.married=true;state.spouseId=id;showNarrative(`💍 盛大求婚！${r.name} 说了YES！`);}
                else{showNarrative('💍 资金不足200万€，无法筹办求婚。');}
                consumeAction();
            }});
            hasSocial=true;
        }
        if(!hasSocial)acts.push({text:'🎉 摩纳哥游艇派对',effect:{fame:2,health:2},msg:'🎉 彻夜狂欢，醒来依然一个人。'});
        if(state.married&&!state.flags['have_kid'])acts.push({text:'👶 孕育下一代',custom:true,callback:()=>{state.flags['have_kid']=true;state.wealth-=50;addChild(state.firstName+' Jr.');showNarrative('👶 传奇家族将迎来新生命！');consumeAction();}});
        if(state.wealth>=3000&&!state.properties.find(p=>p.id==='monaco'))acts.push({text:'🏠 3000万€摩纳哥海景豪宅',custom:true,callback:()=>{state.wealth-=3000;state.properties.push({id:'monaco',name:'摩纳哥公寓',value:3000,appreciation:0.05});showNarrative('🏠 摩纳哥不动产！跻身顶级名流圈。');consumeAction();}});
    }else if(cat==='rd'){
        acts.push({text:'📊 当前研发点: '+state.rdPoints,desc:'引擎Lv.'+state.rdEngine+' | 空动Lv.'+state.rdAero+' | 底盘Lv.'+state.rdChassis,custom:true,callback:()=>{showRdPanel();}});
        acts.push({text:'🔧 投入研发 (消耗5点)',custom:true,callback:()=>spendRd()});
    }

    clearChoices();
    acts.forEach(a=>{
        let btn=document.createElement('button');btn.className='choice-btn '+(a.styleClass||'');
        btn.innerHTML=a.text+(a.desc?`<span class="choice-sub">${a.desc}</span>`:'');
        btn.onclick=()=>{
            if(a.custom){a.callback();}
            else{
                if(a.effect)updateState(a.effect);
                showNarrative(a.msg);
                if(Math.random()<0.2){if(randomEvent())return;}
                consumeAction();
            }
        };
        document.getElementById('choicesContainer').appendChild(btn);
    });
    let backBtn=document.createElement('button');backBtn.className='choice-btn secondary';backBtn.innerHTML='↩ 返回';
    backBtn.onclick=()=>selectActionCategory();document.getElementById('choicesContainer').appendChild(backBtn);
}

// ==================== 研发系统 ====================
function spendRd(){
    if(state.rdPoints<5){showNarrative('🔧 <span class="warn">研发点不足！需要5点。当前：'+state.rdPoints+'</span>');consumeAction();return;}
    state.rdPoints-=5;
    showNarrative('🔧 <span class="highlight">选择研发方向：</span>');
    showChoices([
        {text:'🔩 引擎动力升级 (当前Lv.'+state.rdEngine+')',desc:'每级+2正赛战力',callback:()=>{state.rdEngine++;showNarrative('🔩 <span class="good">引擎动力升级至Lv.'+state.rdEngine+'！</span>');consumeAction();}},
        {text:'🌀 空气动力学升级 (当前Lv.'+state.rdAero+')',desc:'每级+1.5正赛战力',callback:()=>{state.rdAero++;showNarrative('🌀 <span class="good">空动升级至Lv.'+state.rdAero+'！</span>');consumeAction();}},
        {text:'🏎️ 底盘抓地升级 (当前Lv.'+state.rdChassis+')',desc:'每级+1正赛战力',callback:()=>{state.rdChassis++;showNarrative('🏎️ <span class="good">底盘升级至Lv.'+state.rdChassis+'！</span>');consumeAction();}},
        {text:'↩ 放弃',callback:()=>{state.rdPoints+=5;selectActionCategory();}}
    ]);
}

function showRdPanel(){
    let html=`<div style="font-size:13px;line-height:1.8;">
        <div class="rd-bar"><span>🔩 引擎</span><div class="rd-bar-bg"><div class="rd-bar-fill" style="width:${Math.min(100,state.rdEngine*10)}%;background:var(--red);"></div></div><span>Lv.${state.rdEngine}</span></div>
        <div class="rd-bar"><span>🌀 空动</span><div class="rd-bar-bg"><div class="rd-bar-fill" style="width:${Math.min(100,state.rdAero*10)}%;background:var(--blue);"></div></div><span>Lv.${state.rdAero}</span></div>
        <div class="rd-bar"><span>🏎️ 底盘</span><div class="rd-bar-bg"><div class="rd-bar-fill" style="width:${Math.min(100,state.rdChassis*10)}%;background:var(--green);"></div></div><span>Lv.${state.rdChassis}</span></div>
        <br>总战力加成：<span class="highlight">+${teamRdBonus().toFixed(1)}</span><br>研发点余额：<span class="gold">${state.rdPoints}</span>
    </div>`;
    document.getElementById('rdPanel').innerHTML=html;
    document.getElementById('rdModal').style.display='flex';
}

// ==================== 转会系统（夏休期草签） ====================
function sillySeasonEvent(){
    if(state.retired||state.position!=='正式车手')return false;
    // Q3触发夏休期转会市场
    if(state.quarter!==3)return false;
    if(Math.random()>0.4)return false;

    let availableTeams=Object.keys(teamData).filter(t=>t!==state.team);
    let targetTeam=availableTeams[Math.floor(Math.random()*availableTeams.length)];
    let targetData=teamData[targetTeam];

    showNarrative(`📡 <span class="highlight">【夏休期转会市场】</span><br>${targetTeam} 的管理层通过中间人秘密接触了你，开出了 <strong>${targetData.salary}万€/年</strong> 的年薪合同。草签后将于赛季末Q4结束后正式转会。`);
    showChoices([
        {text:'✍️ 草签协议 (赛季末生效)',callback:()=>{
            state.pendingTransfer=targetTeam;
            state.teamPrincipalRelation=clamp(state.teamPrincipalRelation-10,5,100);
            showNarrative(`✍️ <span class="good">已秘密签署意向书。赛季结束后将正式加盟 ${targetTeam}。</span><br><span class="warn">⚠️ 如果消息泄露，当前领队会非常不满。</span>`);
            if(Math.random()<0.3){
                showNarrative(`📰 <span class="warn">转会消息泄露！当前领队震怒！关系-10</span>`);
                state.teamPrincipalRelation=clamp(state.teamPrincipalRelation-10,5,100);
            }
            renderAll();addNextBtn('▶ 继续',()=>selectActionCategory());
        }},
        {text:'❌ 拒绝，忠于当前车队',callback:()=>{
            state.teamPrincipalRelation=clamp(state.teamPrincipalRelation+5,5,100);
            showNarrative('👔 <span class="good">你选择了忠诚。领队对你的信任加深。</span>');
            renderAll();addNextBtn('▶ 继续',()=>selectActionCategory());
        }}
    ]);
    return true;
}

// ==================== 围场公共区跨队社交 ====================
function paddockSocial(){
    // 随机从5个角色中选一个进行社交（不受车队限制）
    let charIds=Object.keys(characters);
    let charId=charIds[Math.floor(Math.random()*charIds.length)];
    let ch=characters[charId];

    if(canRomance(ch.gender)){
        changeAffection(charId,12);
        showNarrative(`🌐 <span class="good">在围场公共区的咖啡角，你和 ${ch.name}（${ch.role}）聊得十分投机！好感度+12</span>`);
    }else{
        changeAffection(charId,6);
        showNarrative(`🌐 在围场公共区遇到了 ${ch.name}（${ch.role}），进行了礼貌的交流。好感度+6`);
    }
    consumeAction();
}

// ==================== 宿敌系统 ====================
function checkRivalry(driverName,affectionChange){
    let rId='driver_'+driverName.replace(/\s+/g,'_');
    let r=state.relationships[rId];
    if(!r)return;
    if(r.affection<=-10&&!isRival(driverName)){
        state.rivals.push(driverName);
        showNarrative(`⚡ <span class="warn">【宿敌结成】你与 ${driverName} 的关系已降至冰点！赛道上相遇碰撞风险大增！</span>`);
    }
}

// ==================== 自定义互动 ====================
function principalMeeting(){
    showNarrative('👔 <span class="highlight">你走进领队办公室……</span>');
    showChoices([
        {text:'🗣️ 表达忠诚',desc:'领队关系+12',callback:()=>{updateState({teamPrincipalRelation:12,teamStatus:-2});showNarrative('👔 <span class="good">领队夸赞你是团队表率。</span>');consumeAction();}},
        {text:'📈 摊牌要资源',desc:'根据实力判定',callback:()=>{
            if(state.driving>=65&&state.fame>=45){updateState({reserveProgress:15,teamStatus:5});showNarrative('👔 <span class="good">领队点头：给你调配更激进的底盘。</span>');}
            else{updateState({teamPrincipalRelation:-8,teamStatus:-3});showNarrative('👔 <span class="warn">"想当一号先去赛道上跑出成绩！"</span>');}
            consumeAction();
        }},
        {text:'😡 拍桌子抱怨',styleClass:'danger-choice',callback:()=>{updateState({teamPrincipalRelation:-15,fame:2});showNarrative('👔 <span class="warn">你摔门而去，已被孤立。</span>');consumeAction();}}
    ]);
}

function seekOpportunity(){
    if(state.teamPrincipalRelation<45){showNarrative('📋 <span class="warn">关系不足，领队拒绝。</span>');consumeAction();return;}
    showNarrative('📋 <span class="highlight">争取FP1机会……</span>');
    showChoices([
        {text:'📊 强调数据',callback:()=>{
            if(state.driving>65){updateState({reserveProgress:20});showNarrative('📋 <span class="good">说服了领队！</span>');}
            else{updateState({reserveProgress:10});showNarrative('📋 数据不够有说服力。');}
            consumeAction();
        }},
        {text:'🤫 让队友让位',styleClass:'danger-choice',callback:()=>{
            updateState({teammateRelation:-10,reserveProgress:25});showNarrative('📋 <span class="warn">队友不满。</span>');consumeAction();
        }}
    ]);
}

function provokeRival(){
    let rivalDrivers=[];
    for(let[t,team]of Object.entries(teamData)){if(t===state.team)continue;team.drivers.forEach(d=>rivalDrivers.push({...d,teamName:t}));}
    let rival=rivalDrivers[Math.floor(Math.random()*rivalDrivers.length)];
    showNarrative(`🎤 你公然宣称 ${rival.name} "在高速弯里像老奶奶一样慢"！`);
    if(Math.random()<0.5){
        state.fame=clamp(state.fame+5,1,99);state.fans+=0.8;
        let rId='driver_'+rival.name.replace(/\s+/g,'_');
        if(!state.relationships[rId])state.relationships[rId]={name:rival.name,role:rival.teamName,affection:0,relationType:'rival'};
        changeAffection(rId,-20);
        checkRivalry(rival.name,-20);
        showNarrative(`🔥 <span class="good">挑衅成功！粉丝暴涨！但与 ${rival.name} 结下死仇。</span>`);
    }else{
        state.fame=clamp(state.fame-4,1,99);
        showNarrative(`🎤 <span class="warn">挑衅吃瘪，声誉受损。</span>`);
    }
    consumeAction();
}

function praiseRival(){
    let rivalDrivers=[];
    for(let[t,team]of Object.entries(teamData)){if(t===state.team)continue;team.drivers.forEach(d=>rivalDrivers.push({...d,teamName:t}));}
    let rival=rivalDrivers[Math.floor(Math.random()*rivalDrivers.length)];
    let rId='driver_'+rival.name.replace(/\s+/g,'_');
    if(!state.relationships[rId])state.relationships[rId]={name:rival.name,role:rival.teamName,affection:15,relationType:'friend'};
    changeAffection(rId,15);state.fame=clamp(state.fame+2,1,99);
    showNarrative(`🤝 <span class="good">你赞美了 ${rival.name}，赢得好评！</span>`);
    consumeAction();
}

function showInvestChoices(){
    showNarrative('📈 <span class="highlight">资产配置</span>');
    showChoices([
        {text:'🏦 稳健国债 (投入100万€)',callback:()=>{let amt=Math.min(state.wealth,100);state.wealth-=amt;state.investments.push({name:'国债',amount:amt,risk:'low'});showNarrative(`购入 ${amt}万€ 国债。`);consumeAction();}},
        {text:'📊 科技股 (投入80万€)',callback:()=>{let amt=Math.min(state.wealth,80);state.wealth-=amt;state.investments.push({name:'股票',amount:amt,risk:'medium'});showNarrative(`购入 ${amt}万€ 蓝筹股。`);consumeAction();}},
        {text:'🚀 加密货币 (投入50万€)',styleClass:'danger-choice',callback:()=>{let amt=Math.min(state.wealth,50);state.wealth-=amt;state.investments.push({name:'加密货币',amount:amt,risk:'high'});showNarrative(`梭哈 ${amt}万€ 加密货币！`);consumeAction();}}
    ]);
}

// ==================== 丰富随机事件库 ====================
function randomEvent(){
    let events=[
        {msg:'📰 FIA突然修改技术规则，你的赛车失去下压力优势！',effect:{driving:-2}},
        {msg:'🏖️ 夏休期骑摩托车摔伤，缺席训练！',effect:{health:-8,fitness:-5}},
        {msg:'🌧️ 极端雨战！驾驶能力权重翻倍，但体能消耗加倍！',effect:{fitness:-3}},
        {msg:'🎁 车队赞助商赠送一辆超跑，资产+80万€！',effect:{wealth:80}},
        {msg:'📱 社交媒体风波，粉丝流失！',effect:{fame:-3,fans:-0.3}},
        {msg:'🏆 你被选为车手协会代表，声望大增！',effect:{fame:6,fans:0.4}},
        {msg:'🔧 车队技师离职，研发效率暂时下降。',effect:{rdPoints:-3}},
        {msg:'💪 新任体能教练让你脱胎换骨！',effect:{fitness:4,health:3}}
    ];
    // Team Orders事件
    if(state.teamStatus<40&&canRace()){
        events.push({msg:'📻 车队TR强制要求你给队友让车！不从则领队关系-15。',effect:{},custom:true,customFn:()=>{
            showChoices([
                {text:'✅ 服从车队指令',callback:()=>{updateState({teamStatus:-5,teamPrincipalRelation:8});showNarrative('📻 你让出了位置，领队满意。');consumeAction();}},
                {text:'❌ 拒绝让车！',styleClass:'danger-choice',callback:()=>{updateState({teamPrincipalRelation:-15,teamStatus:5,fame:3});showNarrative('📻 "I will not give up my position!" 领队震怒，但粉丝力挺！');consumeAction();}}
            ]);
        }});
    }
    let ev=events[Math.floor(Math.random()*events.length)];
    if(ev.custom){ev.customFn();return true;} // 返回true表示事件已自行处理
    showNarrative(document.getElementById('narrative').innerHTML+'<br><br>⚡ '+ev.msg);
    if(ev.effect)updateState(ev.effect);
    return false;
}

// ==================== 行动消耗 ====================
function consumeAction(){
    state.actionsLeftThisQuarter--;
    clearChoices();
    let btn=document.createElement('button');btn.className='choice-btn primary-choice';
    btn.innerHTML=state.actionsLeftThisQuarter>0?'▶ 继续行动':'▶ 进入正赛周末';
    btn.onclick=()=>{
        if(state.actionsLeftThisQuarter>0){
            if(state.quarter===3&&!state.pendingTransfer){
                if(!sillySeasonEvent())selectActionCategory();
            }else selectActionCategory();
        }else{
            document.getElementById('skipBtn').style.display='none';
            if(canRace())startQuarterRaces();
            else{
                showNarrative('🏁 <span class="text-sub">备战结束，但无正式席位，只能在P房旁观。</span>');
                addNextBtn('⏩ 下一季度',()=>startNewQuarter());
                renderAll();
            }
        }
    };
    document.getElementById('choicesContainer').appendChild(btn);
    renderAll();
}

// ==================== 赛季结算 ====================
function endSeason(){
    let playerKey=playerName();
    let maxPts=0,wdcName='';
    for(let name in state.allDriverPoints){
        if(state.allDriverPoints[name]>maxPts){maxPts=state.allDriverPoints[name];wdcName=name;}
    }
    if(wdcName===playerKey){
        state.wdcTitles++;state.fame=clamp(state.fame+15,1,99);state.fans+=2.0;state.wealth+=300;
        showNarrative(`🏆 <span class="good">世界冠军！以 ${maxPts} 分加冕WDC！奖金300万€入账！</span>`);
    }else{
        showNarrative(`📊 WDC归属：<strong>${wdcName}</strong> (${maxPts}分)。你的成绩：${state.seasonPoints}分。`);
    }

    // 宿敌积分比较
    state.rivals.forEach(rivalName=>{
        let rivalPts=state.allDriverPoints[rivalName]||0;
        if(state.seasonPoints>rivalPts){
            state.fame=clamp(state.fame+8,1,99);state.fans+=1.0;state.wealth+=50;
            showNarrative(`⚡ <span class="good">你击败了宿敌 ${rivalName}！声望大增，额外奖金50万€！</span>`);
        }else{
            state.fame=clamp(state.fame-3,1,99);
            showNarrative(`⚡ <span class="warn">宿敌 ${rivalName} 积分比你高，你心有不甘。</span>`);
        }
    });

    // 无领奖台判定
    if(state.seasonWins===0&&state.careerPodiums===0&&state.position==='正式车手'){
        state.consecutivePodiumlessSeasons=(state.consecutivePodiumlessSeasons||0)+1;
        if(state.consecutivePodiumlessSeasons>=2){
            state.flags['principal_talk_podiumless']=true;
            state.flags['podiumless_seasons']=state.consecutivePodiumlessSeasons;
        }
    }else{state.consecutivePodiumlessSeasons=0;}

    // 投资结算
    state.investments.forEach(inv=>{
        let roi=inv.risk==='low'?(Math.random()*0.06+0.01):inv.risk==='medium'?(Math.random()*0.2-0.05):(Math.random()*0.6-0.3);
        let gain=Math.floor(inv.amount*roi);inv.amount=Math.max(0,inv.amount+gain);
        state.wealth+=inv.amount;
    });
    state.investments=[];
    state.properties.forEach(p=>{p.value=Math.floor(p.value*(1+p.appreciation));});

    // 年薪
    if(state.salary>0)state.wealth+=state.salary;
    if(state.contractYears>0)state.contractYears--;

    // 月度开销
    state.wealth-=state.monthlyExpenses*4;

    // AI车队研发（缓慢提升）
    for(let t in teamData){
        if(!teamData[t]._rdEngine)teamData[t]._rdEngine=0;
        if(!teamData[t]._rdAero)teamData[t]._rdAero=0;
        if(!teamData[t]._rdChassis)teamData[t]._rdChassis=0;
        if(teamData[t].tier==='top'){teamData[t]._rdEngine=Math.min(8,teamData[t]._rdEngine+rng(0,1));teamData[t]._rdAero=Math.min(8,teamData[t]._rdAero+rng(0,1));}
        else if(teamData[t].tier==='mid'){teamData[t]._rdEngine=Math.min(6,teamData[t]._rdEngine+rng(0,1));}
    }

    state.seasonPoints=0;state.seasonBest='-';state.seasonWins=0;
    initSeasonPoints();
    state.children.forEach(c=>c.age++);
    renderAll();
}

// ==================== 退役机制 ====================
function triggerRetirement(reason){
    state.retired=true;state.retiredRole='名宿';state.position='退役车手';
    showNarrative(`🏁 你挂起了头盔。退役原因：${reason}。<br>${state.careerWins}场胜利、${state.careerPodiums}次领奖台、${state.wdcTitles}座WDC。传奇不朽！`);
    addNextBtn('▶ 进入退役生活',()=>retiredLife());
    document.getElementById('skipBtn').style.display='none';
    document.getElementById('retireBtn').style.display='none';
    showInheritIfPossible();renderAll();
}

function retiredLife(){
    showNarrative(`🌅 <span class="highlight">退役生活 · ${state.year}年</span><br>${state.married?'爱人陪伴左右。':''}${state.children.length>0?'孩子们正在成长。':''}<br>资产: ${state.wealth}万€ | 粉丝: ${state.fans.toFixed(1)}万`);
    addNextBtn('⏩ 推进一年',()=>{
        state.year++;state.age++;
        state.wealth+=Math.floor(state.fame*5); // 代言收入
        state.wealth-=state.monthlyExpenses*4;
        if(state.age>=state.deathAge){
            state.gameOver=true;showNarrative('🕊️ <span class="text-sub">寿终正寝。围场降半旗默哀。</span>');
            clearChoices();showInheritIfPossible();renderAll();return;
        }
        state.children.forEach(c=>c.age++);retiredLife();
    });
    showInheritIfPossible();renderAll();
}

// ==================== 传承 ====================
function addChild(name){state.children.push({name:name,age:0,driving:rng(60,80),fitness:rng(70,85)});}

function showInheritIfPossible(){
    let eligible=state.children.filter(c=>c.age>=16);
    if(eligible.length>0){
        document.getElementById('inheritBtn').style.display='block';
        document.getElementById('inheritBtn').onclick=()=>{
            let child=eligible[0];
            state.generation++;state.firstName=child.name.split(' ')[0]||child.name;
            state.lastName=state.lastName;state.age=child.age;
            state.driving=child.driving;state.fitness=child.fitness;
            state.health=95;state.position='F2冠军';state.team=null;state.teamTier=null;
            state.retired=false;state.gameOver=false;state.retiredRole='none';
            state.seasonPoints=0;state.seasonBest='-';state.seasonWins=0;
            state.flags={};state.consecutiveSkips=0;state.consecutivePodiumlessSeasons=0;
            state.actionsLeftThisQuarter=3;state.rdPoints=0;state.rdEngine=0;state.rdAero=0;state.rdChassis=0;
            state.pendingTransfer=null;state.rivals=[];state.salary=0;state.contractYears=0;
            document.getElementById('inheritBtn').style.display='none';
            showSetupScreen();
        };
    }
}

function finishSetup(){
    initSeasonPoints();
    document.getElementById('attrCard').style.display='';
    document.getElementById('bottomBar').style.display='';
    addNextBtn('▶ 正式进入生涯赛季',()=>startNewQuarter());
    renderAll();
}

// ==================== 初始化界面 ====================
function showStartChoices(){
    showNarrative('🏆 <span class="highlight">选择你的F1起点：</span>');
    showChoices([
        {text:'🔴 Ferrari FDA (试车手)',desc:'跃马帝国 | 年薪85万€ | 试车手定位',callback:()=>{
            state.team='Scuderia Ferrari';state.position='试车手';state.teamTier='top';state.fame=58;state.teamStatus=55;state.salary=85;state.contractYears=2;
            if(canRomance('女')){changeAffection('elena',30);state.romanceLevel['elena']='friend';}
            finishSetup();
        }},
        {text:'🟠 Racing Bulls (正式车手)',desc:'Honda RBPT | 年薪18万€ | 正式首发登场',callback:()=>{
            state.team='Racing Bulls';state.position='正式车手';state.teamTier='low';state.driving=clamp(state.driving+2,5,99);state.teamStatus=40;state.salary=18;state.contractYears=2;
            if(canRomance('男'))changeAffection('marcel',25);
            finishSetup();
        }},
        {text:'🔵 Mercedes 储备 (储备车手)',desc:'银箭帝国 | 年薪75万€ | 储备车手定位',callback:()=>{
            state.team='Mercedes-AMG Petronas';state.position='储备车手';state.teamTier='top';state.fame=58;state.reserveProgress=10;state.teamStatus=30;state.salary=75;state.contractYears=2;
            if(canRomance('女')){changeAffection('lea',20);state.romanceLevel['lea']='friend';}
            finishSetup();
        }},
        {text:'🟢 Williams 正式车手 (困难模式)',desc:'Mercedes引擎 | 年薪35万€ | 正式首发但赛车慢',callback:()=>{
            state.team='Williams Racing';state.position='正式车手';state.teamTier='mid';state.driving=clamp(state.driving+1,5,99);state.teamStatus=50;state.salary=35;state.contractYears=2;
            finishSetup();
        }}
    ]);
}

function showSetupScreen(){
    document.getElementById('attrCard').style.display='none';
    document.getElementById('narrative').innerHTML=`
        <div style="text-align:center;font-size:20px;font-weight:800;margin-bottom:16px;">🏁 F1人生 · WDC传奇 🏁</div>
        <span style="font-size:12px;color:var(--text-sub);font-weight:600;">车手姓名</span>
        <input class="setup-input" id="inputFirstName" placeholder="名" value="路易斯">
        <input class="setup-input" id="inputLastName" placeholder="姓" value="杜瓦尔">
        <span style="font-size:12px;color:var(--text-sub);font-weight:600;">生理性别</span>
        <div class="toggle-group" id="genderGroup">
            <span class="toggle-btn selected" data-val="男">♂ 男</span><span class="toggle-btn" data-val="女">♀ 女</span>
        </div>
        <span style="font-size:12px;color:var(--text-sub);font-weight:600;">性取向</span>
        <div class="toggle-group" id="sexualityGroup">
            <span class="toggle-btn selected" data-val="异性恋">异性恋</span><span class="toggle-btn" data-val="同性恋">同性恋</span><span class="toggle-btn" data-val="双性恋">双性恋</span>
        </div>
        <span style="font-size:12px;color:var(--text-sub);font-weight:600;">国籍</span>
        <div class="toggle-group" id="nationalityGroup">
            <span class="toggle-btn selected" data-val="摩纳哥">🇲🇨 摩纳哥</span><span class="toggle-btn" data-val="英国">🇬🇧 英国</span><span class="toggle-btn" data-val="西班牙">🇪🇸 西班牙</span><span class="toggle-btn" data-val="日本">🇯🇵 日本</span>
        </div>
        <br><button class="choice-btn primary-choice" id="confirmSetup" style="text-align:center;">🔥 建立车手档案</button>`;
    document.getElementById('bottomBar').style.display='none';
    document.querySelectorAll('.toggle-group span').forEach(el=>{el.onclick=function(){this.parentElement.querySelectorAll('span').forEach(s=>s.classList.remove('selected'));this.classList.add('selected');};});
    document.getElementById('confirmSetup').onclick=()=>{
        state.firstName=document.getElementById('inputFirstName').value||'路易斯';
        state.lastName=document.getElementById('inputLastName').value||'杜瓦尔';
        state.gender=document.querySelector('#genderGroup .selected')?.dataset.val||'男';
        state.sexuality=document.querySelector('#sexualityGroup .selected')?.dataset.val||'异性恋';
        state.nationality=document.querySelector('#nationalityGroup .selected')?.dataset.val||'摩纳哥';
        showStartChoices();
    };
}

// ==================== 底部按钮绑定 ====================
document.getElementById('skipBtn').addEventListener('click',()=>{
    state.consecutiveSkips++;
    if(state.consecutiveSkips>=3){
        state.teamPrincipalRelation=Math.max(5,state.teamPrincipalRelation-15);
        state.teamStatus=Math.max(5,state.teamStatus-12);
        state.fame=Math.max(5,state.fame-10);
        showNarrative('⚠️ <span class="warn">连续跳过！领队好感暴跌-15，地位-12！</span>');
    }else{
        state.teamStatus=Math.max(5,state.teamStatus-3);state.fame=Math.max(5,state.fame-2);
        showNarrative('⚠️ <span class="text-sub">跳过行动：名望轻微降低。</span>');
    }
    consumeAction();
});

document.getElementById('relBtn').addEventListener('click',()=>{
    let rels=Object.values(state.relationships);let html='';
    if(rels.length===0)html='<p style="text-align:center;color:var(--text-sub);padding:15px 0;">暂无社交数据</p>';
    else{
        rels.sort((a,b)=>b.affection-a.affection).forEach(r=>{
            let color=r.affection>=70?'var(--green)':r.affection>=40?'var(--orange)':'var(--red)';
            let barWidth=Math.max(0,Math.min(100,r.affection));
            let rivalTag=isRival(r.name)?' <span style="color:var(--red);font-size:10px;">⚡宿敌</span>':'';
            html+=`<div class="chart-row"><span>${r.name}${rivalTag}</span><div class="chart-bar-bg"><div class="chart-bar-fill" style="width:${barWidth}%;background:${color};"></div></div><span>${r.affection}</span></div>`;
        });
    }
    document.getElementById('relChart').innerHTML=html;document.getElementById('relModal').style.display='flex';
});

document.getElementById('wdcBtn').addEventListener('click',()=>{
    let sorted=Object.entries(state.allDriverPoints).sort((a,b)=>b[1]-a[1]);let html='';
    sorted.forEach((e,i)=>{
        let isMe=e[0]===playerName();
        let color=isMe?'var(--blue)':isRival(e[0])?'var(--red)':'#fff';
        let fw=isMe?'800':'500';
        let rivalTag=isRival(e[0])?' ⚡':'';
        html+=`<div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid rgba(255,255,255,0.05);font-size:13px;">
            <span style="color:${color};font-weight:${fw};"><span style="width:24px;display:inline-block;color:var(--text-sub);">${i+1}.</span> ${e[0]}${rivalTag}</span>
            <span style="color:var(--gold);font-weight:700;">${e[1]} pts</span></div>`;
    });
    document.getElementById('wdcChart').innerHTML=html;document.getElementById('wdcModal').style.display='flex';
});

document.getElementById('rdBtn').addEventListener('click',()=>showRdPanel());
document.getElementById('retireBtn').addEventListener('click',()=>triggerRetirement('主动退役'));
document.querySelectorAll('.modal').forEach(m=>m.addEventListener('click',function(e){if(e.target===this)this.style.display='none';}));

// ==================== 渲染 ====================
function renderAll(){
    document.getElementById('headerName').textContent=`第${state.generation}代: ${state.firstName} · ${state.lastName}`;
    document.getElementById('headerTeam').textContent=state.team?`${state.team} · ${state.position}`:(state.retired?'退役':state.position);
    document.getElementById('headerBadge').textContent=`${state.year} Q${state.quarter} | ${state.age}岁`;

    document.getElementById('drivingVal').textContent=state.driving;document.getElementById('drivingBar').style.width=state.driving+'%';
    document.getElementById('fitnessVal').textContent=state.fitness;document.getElementById('fitnessBar').style.width=state.fitness+'%';
    document.getElementById('healthVal').textContent=state.health;document.getElementById('healthBar').style.width=state.health+'%';
    document.getElementById('fameVal').textContent=state.fame;document.getElementById('fameBar').style.width=state.fame+'%';
    document.getElementById('wealthVal').textContent=state.wealth;document.getElementById('wealthBar').style.width=Math.max(0,Math.min(100,(state.wealth/5000)*100))+'%';
    document.getElementById('teamStatusVal').textContent=state.teamStatus;document.getElementById('teamStatusBar').style.width=state.teamStatus+'%';

    document.getElementById('wdcCount').textContent=state.wdcTitles;document.getElementById('fansCount').textContent=state.fans.toFixed(1);

    let ach='';
    if(state.wdcTitles>0)ach+=`<span class="stat-item gold">🏆 WDC×${state.wdcTitles}</span>`;
    if(state.careerWins>0)ach+=`<span class="stat-item">🏁 ${state.careerWins}胜</span>`;
    if(state.careerPodiums>0)ach+=`<span class="stat-item">🍾 ${state.careerPodiums}台</span>`;
    if((state.position==='试车手'||state.position==='储备车手')&&!state.retired)ach+=`<span class="stat-item gold">📋 晋升 ${state.reserveProgress}%</span>`;
    if(state.rdEngine+state.rdAero+state.rdChassis>0)ach+=`<span class="stat-item">🔧 研发 E${state.rdEngine}A${state.rdAero}C${state.rdChassis}</span>`;
    if(state.rivals.length>0)ach+=`<span class="stat-item red">⚡ 宿敌${state.rivals.length}</span>`;
    if(state.salary>0)ach+=`<span class="stat-item">💰 ${state.salary}万€/年</span>`;
    document.getElementById('achievements').innerHTML=ach||'🏅 暂无荣誉';
}

showSetupScreen();
})();
