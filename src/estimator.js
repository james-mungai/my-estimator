const covid19ImpactEstimator = (data) => {
  const {
    reportedCases, totalHospitalBeds, region, timeToElapse, periodType
  } = data;
  const { avgDailyIncomeInUSD, avgDailyIncomePopulation } = region;

  let timeInDays;

  switch (periodType) {
    case 'days':
      timeInDays = timeToElapse;
      break;
    case 'weeks':
      timeInDays = timeToElapse * 7;
      break;
    case 'months':
      timeInDays = timeToElapse * 30;
      break;
    default:
      break;
  }

  const timeFactor = Math.floor(timeInDays / 3);

  const crntlyInfctdNrml = reportedCases * 10;
  const crntlyInfctdSvr = reportedCases * 50;

  const infcByRqstdTmNrml = crntlyInfctdNrml * (2 ** timeFactor);
  const infcByRqstdTmSvr = crntlyInfctdSvr * (2 ** timeFactor);


  const svrCsByRqsdTmNrml = Math.floor(infcByRqstdTmNrml * 0.15);
  const svrCsByRqsdTmSvr = Math.floor(infcByRqstdTmSvr * 0.15);

  const THB = totalHospitalBeds;

  const bdByRqstdTmNrml = Math.floor(THB * 0.35) - svrCsByRqsdTmNrml;
  const bdByRqstdTmSvr = Math.floor(THB * 0.35) - svrCsByRqsdTmSvr;

  const icuCsByRqstdTmNrml = Math.floor(0.05 * infcByRqstdTmNrml);
  const icuCsByRqstdTmSvr = Math.floor(0.05 * infcByRqstdTmSvr);

  const ventCsByRqstdTmNrml = Math.floor(0.02 * infcByRqstdTmNrml);
  const ventCsByRqstdTmSvr = Math.floor(0.02 * infcByRqstdTmSvr);

  const AVDIU = avgDailyIncomeInUSD;
  const AVDIP = avgDailyIncomePopulation;

  const dlrFlghtN = Math.floor(((infcByRqstdTmNrml * AVDIU) * AVDIP) / 30);
  const dlrFlghtS = Math.floor((infcByRqstdTmSvr * AVDIU * AVDIP) / 30);

  return {
    data,
    impact: {
      currentlyInfected: crntlyInfctdNrml,
      infectionsByRequestedTime: infcByRqstdTmNrml,
      severeCasesByRequestedTime: svrCsByRqsdTmNrml,
      hospitalBedsByRequestedTime: bdByRqstdTmNrml,
      casesForICUByRequestedTime: icuCsByRqstdTmNrml,
      casesForVentilatorsByRequestedTime: ventCsByRqstdTmNrml,
      dollarsInFlight: dlrFlghtN
    }, // best case estimation
    severeImpact: {
      currentlyInfected: crntlyInfctdSvr,
      infectionsByRequestedTime: infcByRqstdTmSvr,
      severeCasesByRequestedTime: svrCsByRqsdTmSvr,
      hospitalBedsByRequestedTime: bdByRqstdTmSvr,
      casesForICUByRequestedTime: icuCsByRqstdTmSvr,
      casesForVentilatorsByRequestedTime: ventCsByRqstdTmSvr,
      dollarsInFlight: dlrFlghtS
    } // severe case estimation
  };
};

export default covid19ImpactEstimator;
