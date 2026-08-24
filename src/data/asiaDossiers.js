export const THEMES = {
  all: 'All themes',
  captive: 'Captive industrial generation',
  distributed: 'Distributed solar outrunning statistics',
  fleet: 'Young coal fleet exposure',
  gas: 'Gas and LNG lock-in',
  grid: 'Grid constraint and curtailment',
  cost: 'Reserve and system cost',
};

export const STATS_ONLY = { KZ: 0.31, UZ: 0.27, TH: 0.34, MY: 0.29, MM: 0.44, KH: 0.36, LA: 0.22, NP: 0.18, LK: 0.41, KR: 0.19, TW: 0.16, MN: 0.26, AF: 0.30, TJ: 0.21, KG: 0.23, TM: 0.35, BT: 0.12, SG: 0.11, BN: 0.20, KP: 0.48, TL: 0.28 };

export const CH = { ok: '#0B6638', part: '#FFC400', bad: '#ED480D', casc: '#9AA1B0' };
export const CHL = { ok: 'measured', part: 'partial', bad: 'break', casc: 'cascade' };

export const D = {
  ID: { name:'Indonesia', tier:'deep', arch:'Fast-growth builder', rev:'Aug 2026', div:0.86,
    stats:{
      planner:[['Coal share of generation','62%'],['Clean share','19%'],['Demand growth, 5yr','5.1%'],['Capacity outside the plan','~11 GW']],
      regulator:[['Regulated tariff coverage','Subsidised'],['Contracted vs peak demand','Oversupplied'],['Captive under tariff scope','None'],['Clean share','19%']]
    },
    narr:[
      { t:'Captive coal is growing outside the plan', code:'METRIC', themes:['captive','fleet'],
        why:'Smelter captive generation sits outside the grid system and outside the statistics your capacity plan is built on. You are planning against a denominator missing roughly a tenth of the fleet.',
        gap:{unit:'GW of coal capacity', official:62, ground:73, olab:'In the series', glab:'Operating', note:'11 GW operating but definitionally excluded from the national series.'},
        chain:[
          ['Physically operating',100,'ok','—','Plant trackers, equipment import records and company disclosures put the fleet materially above any official series. The only row measured from the ground rather than from paperwork.',['Plant trackers','Equipment imports','Company disclosures']],
          ['Permitted nationally',58,'part','COORD','Permitting splits across national and regional authorities, with industrial estates under a separate regime. No single body holds a complete list.',['National permit register','Provincial registers']],
          ['Under reporting duty',31,'part','DESIGN','Reporting obligations were written around grid-connected generation. Off-grid captive is largely outside the duty — a scope gap, not a compliance failure.',['Regulation text','Compliance returns']],
          ['In national series',3,'bad','METRIC','The primary break. The published series is scoped to the public grid by construction, so captive output is excluded as a matter of definition rather than omission.',['Series methodology','Verified generation data']],
          ['In plan baseline',0,'casc','—','Downstream of the break. Reserve margin, demand forecasts and retirement schedules are all computed against the incomplete denominator.',['Plan methodology']],
          ['In emissions accounting',0,'casc','—','Also downstream. A phase-out commitment scoped to grid-connected generation can be fully met while total coal burn rises.',['Inventory methodology']]
        ],
        lev:{ planner:[['Extend reporting duty to captive above threshold','Ministerial regulation — yours',1],['Redefine series scope, or publish a parallel captive series','Statistics agency — shared',1],['Condition industrial estate licensing on generation disclosure','Ministerial regulation — yours',1],['Widen the emissions accounting boundary','Environment ministry',0]],
               regulator:[['Bring captive above threshold into licensing scope','Rules amendment — yours',1],['Extend reporting duty to captive','Ministry',0],['Redefine series scope','Statistics agency',0]] } },
      { t:'Contracted capacity has outrun demand', code:'INCENTIVE', themes:['gas','fleet'],
        why:'Take-or-pay terms mean the Java–Bali system pays fixed costs on capacity it does not dispatch. Every additional agreement compounds it.',
        gap:{unit:'% of contracted capacity dispatched', official:100, ground:64, olab:'Contracted', glab:'Dispatched', note:'A third of contracted capacity is paid for and not used.'},
        chain:[
          ['Capacity contracted',100,'ok','—','Signed agreements across the Java–Bali system, fully visible in utility accounts.',['Utility accounts']],
          ['Technically available',94,'ok','—','Availability is not the constraint. Plants are largely able to run when called.',['Dispatch records']],
          ['Economically dispatched',64,'bad','INCENTIVE','The break. Contracts guarantee payment whether or not energy is taken, so the utility carries fixed cost against falling utilisation with no mechanism to renegotiate.',['Utility accounts','Dispatch records']],
          ['Cost recovered in tariff',0,'casc','—','Downstream. The shortfall lands on subsidy or utility balance sheet rather than being visible as a system cost.',['Fiscal accounts']]
        ],
        lev:{ planner:[['Pause new capacity procurement in oversupplied systems','Plan revision — yours',1],['Renegotiate availability terms at contract renewal','Utility — shared',1],['Publish system-level utilisation','Ministerial regulation — yours',1]],
              regulator:[['Require utilisation disclosure in tariff filings','Rate order — yours',1],['Test contract prudence at cost recovery','Rate order — yours',1]] } }
    ],
    peers:{ planner:['Vietnam — plan revision after oversupply lock-in','India — captive power licensing regime','Malaysia — smelter demand and grid planning'],
            regulator:['India state regulators — captive licensing','Vietnam — direct purchase arrangements'] } },

  PH: { name:'Philippines', tier:'deep', arch:'Liberalised market', rev:'Aug 2026', div:0.54,
    stats:{
      planner:[['Clean share','22%'],['Reserve margin at peak','Thin'],['Committed coal pipeline','Pre-moratorium'],['Demand growth, 5yr','4.4%']],
      regulator:[['Residential tariff vs region','Highest quartile'],['Reserve cost share of bill','Rising'],['Spot exposure','High'],['Clean share','22%']]
    },
    narr:[
      { t:'Reserve costs are outpacing energy costs', code:'DESIGN', themes:['cost','grid'],
        why:'The ancillary services component is growing faster than the energy component of the bill. Procurement design, not fuel prices, is the driver.',
        gap:{unit:'index, 2020 = 100', official:118, ground:174, olab:'Energy cost', glab:'Reserve cost', note:'Reserve procurement is the fastest-growing line on the bill and the least scrutinised.'},
        chain:[
          ['Reserve requirement set',100,'ok','—','Requirement is defined in the grid code and published. Not in dispute.',['Grid code']],
          ['Procured competitively',46,'part','DESIGN','A majority of reserve is contracted bilaterally rather than through competitive process, limiting price discovery.',['Procurement filings']],
          ['Cost tested at approval',22,'bad','DESIGN','The break. Reserve cost enters the bill largely as pass-through without the prudence testing applied to energy cost.',['Rate filings','Tariff decisions']],
          ['Visible to consumers',8,'casc','—','Downstream. The component is aggregated in billing, so neither consumers nor most intervenors can see it move.',['Billing formats']]
        ],
        lev:{ regulator:[['Require competitive reserve procurement','Rules amendment — yours',1],['Apply prudence test to reserve cost','Rate order — yours',1],['Unbundle the reserve line on bills','Rules amendment — yours',1],['Revise grid code reserve requirement','System operator — shared',0]],
              planner:[['Revise reserve requirement in planning standards','Department — yours',1],['Support storage procurement to displace thermal reserve','Plan revision — yours',1]] } },
      { t:'Distributed solar is blocked by rule, not economics', code:'PROCESS', themes:['distributed','grid'],
        why:'Installation economics turned favourable some time ago. Net metering caps and interconnection process are now the binding constraint.',
        gap:{unit:'MW of rooftop potential realised', official:100, ground:31, olab:'Economic', glab:'Installed', note:'Roughly two-thirds of economically viable rooftop capacity is not being built.'},
        chain:[
          ['Economically viable',100,'ok','—','Installed cost against retail tariff makes rooftop attractive across most of the franchise areas.',['Cost benchmarks','Tariff data']],
          ['Eligible under caps',54,'part','DESIGN','System-size and aggregate caps exclude a large share of otherwise viable installations by rule.',['Net metering rules']],
          ['Application approved',38,'part','PROCESS','Documentation and utility sign-off add months; a material share lapse rather than being refused.',['Utility filings']],
          ['Energised',31,'bad','PROCESS','The break. Meter installation and final inspection are the slowest steps, and no service standard binds them.',['Interconnection records']]
        ],
        lev:{ regulator:[['Raise or remove aggregate net metering caps','Rules amendment — yours',1],['Set a binding energisation service standard','Rules amendment — yours',1],['Standardise interconnection documentation','Licence conditions — yours',1]],
              planner:[['Reflect distributed capacity in demand forecasts','Plan revision — yours',1],['Raise net metering caps','Regulator',0]] } }
    ],
    peers:{ regulator:['Singapore — reserve procurement redesign','India state regulators — net metering caps','Vietnam — direct purchase arrangement design'],
            planner:['Vietnam — rooftop surge and forecast revision','Thailand — reserve planning standards'] } },

  VN: { name:'Vietnam', tier:'deep', arch:'Fast-growth builder', rev:'Jul 2026', div:0.71,
    stats:{
      planner:[['Clean share','43%'],['Coal share','43%'],['Demand growth, 5yr','7.9%'],['Curtailed clean output','Material']],
      regulator:[['Tariff structure','Regulated single buyer'],['Direct purchase uptake','Early'],['Curtailment compensation','None'],['Clean share','43%']]
    },
    narr:[
      { t:'Curtailment is absorbed silently by generators', code:'INCENTIVE', themes:['grid','distributed'],
        why:'Clean output is curtailed without compensation, so the cost sits with generators and never appears as a system cost in planning or tariffs.',
        gap:{unit:'TWh of clean generation', official:100, ground:112, olab:'Delivered', glab:'Available', note:'Curtailed volume is not recorded as a system cost anywhere.'},
        chain:[
          ['Available clean output',100,'ok','—','Resource and installed capacity support materially more output than is delivered.',['Plant metering','Resource data']],
          ['Dispatched',88,'bad','INCENTIVE','The break. Curtailment falls on generators without compensation, so the system operator faces no cost signal to relieve it.',['Dispatch records','Plant metering']],
          ['Curtailment recorded',34,'part','METRIC','Curtailment is inconsistently logged and not published at plant level, so its scale is contested.',['Operator reports']],
          ['Reflected in planning',0,'casc','—','Downstream. Grid investment cases understate benefit because the avoided curtailment is invisible.',['Plan methodology']]
        ],
        lev:{ planner:[['Publish plant-level curtailment data','Ministerial decision — yours',1],['Value avoided curtailment in grid investment cases','Plan revision — yours',1],['Sequence new connections to grid readiness','Plan revision — yours',1]],
              regulator:[['Introduce curtailment compensation','Tariff decision — yours',1],['Require curtailment disclosure','Rules amendment — yours',1]] } },
      { t:'Captive industrial generation is expanding', code:'METRIC', themes:['captive'],
        why:'Industrial parks are adding self-supply outside the single-buyer system, and the statistical series does not capture it.',
        gap:{unit:'GW industrial self-supply', official:4, ground:9, olab:'Recorded', glab:'Estimated', note:'Self-supply capacity is roughly double the recorded figure.'},
        chain:[
          ['Operating',100,'ok','—','Industrial park disclosures and equipment imports indicate substantially more self-supply than is recorded.',['Equipment imports','Park disclosures']],
          ['Licensed',61,'part','COORD','Licensing runs through provincial authorities with no consolidated national register.',['Provincial registers']],
          ['In national series',26,'bad','METRIC','The break. The series covers the single-buyer system; self-supply falls outside its scope.',['Series methodology']],
          ['In plan baseline',0,'casc','—','Downstream. Demand forecasts treat industrial load as grid load that will materialise.',['Plan methodology']]
        ],
        lev:{ planner:[['Consolidate provincial licensing into a national register','Ministerial decision — yours',1],['Extend the series to cover self-supply','Statistics agency — shared',1]],
              regulator:[['Bring self-supply above threshold into licensing','Rules amendment — yours',1]] } }
    ],
    peers:{ planner:['Indonesia — captive coal outside the plan','India — captive power licensing','China — provincial curtailment disclosure'],
            regulator:['Philippines — interconnection service standards','India — curtailment compensation'] } },

  IN: { name:'India', tier:'deep', arch:'Scale-setter', rev:'Aug 2026', div:0.63,
    stats:{
      planner:[['Coal share of generation','70%'],['Clean share','24%'],['Demand growth, 5yr','6.2%'],['Peak demand record','Rising fast']],
      regulator:[['Distribution utility losses','Material'],['Open access uptake','Constrained'],['Captive under tariff scope','Partial'],['Clean share','24%']]
    },
    narr:[
      { t:'Captive and open-access generation sits outside the series', code:'METRIC', themes:['captive','distributed'],
        why:'A substantial share of industrial supply bypasses the utility, and much of it is recorded inconsistently across state boundaries.',
        gap:{unit:'GW industrial self-supply', official:52, ground:68, olab:'Recorded', glab:'Estimated', note:'State-level reporting inconsistency accounts for most of the gap.'},
        chain:[
          ['Operating',100,'ok','—','Cross-referencing state registers against equipment and industrial output data indicates consistent under-recording.',['State registers','Equipment imports']],
          ['Recorded by state',76,'part','COORD','Reporting formats and thresholds differ by state, so aggregation loses capacity at the seams.',['State registers']],
          ['In national series',76,'part','METRIC','The series aggregates what states report; it inherits their inconsistency rather than adding its own.',['Series methodology']],
          ['In plan baseline',76,'part','—','Planning uses the same figure, so the error is consistent rather than compounding.',['Plan methodology']]
        ],
        lev:{ planner:[['Standardise state reporting thresholds and formats','Central guideline — yours',1],['Reconcile registers against equipment import data','Ministry — yours',1]],
              regulator:[['Harmonise open access reporting','Central commission — yours',1],['Require captive disclosure at connection','Rules amendment — yours',1]] } },
      { t:'Distribution finances constrain procurement choices', code:'FINANCE', themes:['cost'],
        why:'Utility payment delays raise the cost of capital for every generator bidding, which shows up as higher tariffs rather than as a balance-sheet problem.',
        gap:{unit:'days payable', official:45, ground:132, olab:'Contract terms', glab:'Actual', note:'Payment delay is priced into every bid received.'},
        chain:[
          ['Energy delivered',100,'ok','—','Generation is delivered against contract without dispute in most cases.',['Dispatch records']],
          ['Invoiced on time',91,'ok','—','Invoicing is not the constraint.',['Utility accounts']],
          ['Paid within terms',34,'bad','FINANCE','The break. Payment delay is systemic rather than exceptional, and generators price it into subsequent bids.',['Utility accounts','Bid data']],
          ['Reflected in bid prices',0,'casc','—','Downstream. The cost of delay is recovered through higher tariffs, so it never appears as a financing problem.',['Bid data']]
        ],
        lev:{ regulator:[['Enforce payment security mechanisms','Rules amendment — yours',1],['Publish utility payment performance','Commission order — yours',1]],
              planner:[['Condition central support on payment performance','Scheme guideline — yours',1]] } }
    ],
    peers:{ planner:['Indonesia — captive outside the plan','Vietnam — provincial licensing consolidation'],
            regulator:['Philippines — utility performance disclosure','Bangladesh — capacity payment exposure'] } },

  PK: { name:'Pakistan', tier:'deep', arch:'Import-exposed economy', rev:'Aug 2026', div:0.91,
    stats:{
      planner:[['Clean share','35%'],['Demand growth, 5yr','Flat'],['Grid demand trend','Falling'],['Solar panel imports','Surging']],
      regulator:[['Residential tariff trend','Rising sharply'],['Capacity payment share','Dominant'],['Grid sales trend','Falling'],['Clean share','35%']]
    },
    narr:[
      { t:'Rooftop solar is leaving the grid and the statistics', code:'METRIC', themes:['distributed'],
        why:'Panel imports point to a distributed buildout far larger than anything recorded. Grid demand is falling and the plan does not know why.',
        gap:{unit:'GW distributed solar', official:2, ground:15, olab:'Recorded', glab:'Imported', note:'Import volumes imply a fleet several times the recorded figure. This is the widest gap on the map.'},
        chain:[
          ['Panels imported',100,'ok','—','Customs data is unambiguous and independently verifiable. The strongest evidence on this page.',['Customs data','Trade statistics']],
          ['Installed',86,'ok','—','Installer activity and distributor sales corroborate that imported volume is being deployed rather than stockpiled.',['Distributor sales','Installer surveys']],
          ['Registered with utility',19,'bad','PROCESS','The break. Registration offers the consumer little and costs time, so most installations never enter any register.',['Utility registers']],
          ['In national series',13,'casc','—','Downstream. The series counts registered capacity, so it counts a fraction.',['Series methodology']],
          ['In demand forecast',0,'casc','—','Downstream. Falling grid demand is read as economic weakness rather than as substitution, driving the wrong planning response.',['Plan methodology']]
        ],
        lev:{ planner:[['Estimate distributed capacity from customs data','Ministry analysis — yours',1],['Rebuild demand forecasts on a substitution basis','Plan revision — yours',1],['Make registration worth doing for the consumer','Regulator',0]],
              regulator:[['Simplify and incentivise registration','Rules amendment — yours',1],['Reflect substitution in tariff design','Tariff determination — yours',1],['Review capacity payment exposure against falling sales','Determination — yours',1]] } }
    ],
    peers:{ planner:['Bangladesh — capacity payment exposure','Philippines — distributed capacity in forecasts'],
            regulator:['Philippines — net metering caps','India — open access reporting'] } },

  JP: { name:'Japan', tier:'standard', arch:'Mature decarboniser', rev:'Jun 2026', div:0.24,
    stats:{ planner:[['Clean share','31%'],['LNG import dependence','High'],['Demand growth, 5yr','Flat'],['Nuclear availability','Partial']],
            regulator:[['Retail competition','Established'],['Capacity market','Operating'],['Grid access queue','Constrained'],['Clean share','31%']] },
    narr:[
      { t:'Grid access queues are the binding constraint', code:'PROCESS', themes:['grid'],
        why:'Connection queues rather than resource or finance now determine how much clean capacity is built and where.',
        gap:{unit:'GW in queue vs connected annually', official:4, ground:31, olab:'Connected', glab:'In queue', note:'Queue depth is many times annual connection throughput.'},
        chain:[
          ['Projects proposed',100,'ok','—','Development pipeline is substantially larger than delivery.',['Developer filings']],
          ['Queue position granted',72,'part','PROCESS','Queue entry is available but position does not imply timeline.',['Operator queue data']],
          ['Connection studied',41,'part','CAPACITY','Study throughput is the visible bottleneck, though not the deepest one.',['Operator reports']],
          ['Connected',13,'bad','PROCESS','The break. Sequencing rules favour queue order over readiness, so ready projects wait behind stalled ones.',['Connection records']]
        ],
        lev:{ planner:[['Move to readiness-based queue sequencing','Ministry guideline — yours',1],['Fund anticipatory grid investment','Plan revision — yours',1]],
              regulator:[['Set connection study service standards','Rules amendment — yours',1],['Introduce queue milestone requirements','Rules amendment — yours',1]] } }
    ],
    peers:{ planner:['Korea — grid queue reform','Vietnam — connection sequencing'], regulator:['Philippines — interconnection standards'] } },

  BD: { name:'Bangladesh', tier:'standard', arch:'Import-exposed economy', rev:'Jul 2026', div:0.68,
    stats:{ planner:[['Clean share','4%'],['Coal and gas share','95%'],['Demand growth, 5yr','5.6%'],['Idle contracted capacity','High']],
            regulator:[['Capacity payment share','Dominant'],['Tariff subsidy','Heavy'],['Fuel import exposure','High'],['Clean share','4%']] },
    narr:[
      { t:'Capacity payments dominate the cost base', code:'INCENTIVE', themes:['gas','cost'],
        why:'Contracted capacity substantially exceeds what is dispatched, and the fixed payments fall on subsidy rather than surfacing as a system cost.',
        gap:{unit:'% of contracted capacity dispatched', official:100, ground:43, olab:'Contracted', glab:'Dispatched', note:'More than half of contracted capacity is paid for and idle.'},
        chain:[
          ['Capacity contracted',100,'ok','—','Agreements are visible in utility accounts and not disputed.',['Utility accounts']],
          ['Available',89,'ok','—','Availability is not the constraint.',['Dispatch records']],
          ['Dispatched',43,'bad','INCENTIVE','The break. Take-or-pay terms decouple payment from dispatch, so idle capacity carries full fixed cost.',['Dispatch records','Utility accounts']],
          ['Visible as system cost',0,'casc','—','Downstream. The cost lands on fiscal subsidy rather than on a tariff line anyone scrutinises.',['Fiscal accounts']]
        ],
        lev:{ planner:[['Halt new capacity contracting pending review','Ministry decision — yours',1],['Publish dispatch against contracted capacity','Ministry — yours',1]],
              regulator:[['Test capacity payments at tariff review','Determination — yours',1],['Require dispatch disclosure','Rules amendment — yours',1]] } }
    ],
    peers:{ planner:['Indonesia — contracted capacity oversupply','Pakistan — capacity payment exposure'], regulator:['Pakistan — capacity payment review'] } },

  CN: { name:'China', tier:'standard', arch:'Scale-setter', rev:'Aug 2026', div:0.38,
    stats:{ planner:[['Clean share','36%'],['Coal share','58%'],['Demand growth, 5yr','6.0%'],['Curtailment trend','Rising']],
            regulator:[['Market reform stage','Provincial pilots'],['Interprovincial trade','Constrained'],['Curtailment compensation','Partial'],['Clean share','36%']] },
    narr:[
      { t:'Provincial boundaries suppress interprovincial trade', code:'COORD', themes:['grid'],
        why:'Provincial dispatch preference keeps clean output bottled behind boundaries while neighbouring provinces run thermal plant.',
        gap:{unit:'TWh available for export vs traded', official:100, ground:148, olab:'Traded', glab:'Available', note:'Available surplus substantially exceeds what crosses provincial boundaries.'},
        chain:[
          ['Surplus available',100,'ok','—','Resource and capacity data show consistent exportable surplus in western provinces.',['Provincial generation data']],
          ['Transmission capable',81,'ok','—','Physical transmission capacity is largely adequate for more trade than occurs.',['Grid capacity data']],
          ['Scheduled for trade',67,'part','COORD','Interprovincial scheduling requires bilateral agreement that favours local generation.',['Trade records']],
          ['Actually traded',67,'part','COORD','The seam sits between provincial dispatch authorities with no body owning the interface.',['Trade records']]
        ],
        lev:{ planner:[['Set interprovincial trade volume targets','Central guideline — yours',1],['Publish curtailment by province','Ministry — yours',1]],
              regulator:[['Standardise interprovincial trading rules','Rules amendment — yours',1]] } }
    ],
    peers:{ planner:['India — interstate transmission access','Vietnam — curtailment disclosure'], regulator:['India — central commission trading rules'] } }
};
