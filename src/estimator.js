const covid19ImpactEstimator = (data) => {
  const {
    reportedCases, totalHospitalBeds, region, timeToElapse, periodType
  } = data;

  let timeToElapseInDays;

  switch (periodType) {
    case 'days':
      timeToElapseInDays = timeToElapse;
      break;
    case 'weeks':
      timeToElapseInDays = timeToElapse * 7;
      break;
    case 'months':
      timeToElapseInDays = timeToElapse * 30;
      break;
    default:
      break;
  }

  const { avgDailyIncomeInUSD, avgDailyIncomePopulation } = region;

  const normalisedTimeFactor = 2 ** Math.floor(timeToElapseInDays / 3);

  const currentlyInfectedNormal = reportedCases * 10;
  const currentlyInfectedSevere = reportedCases * 50;


  const infectionsByRequestedTimeNormal = currentlyInfectedNormal * normalisedTimeFactor;
  const infectionsByRequestedTimeSevere = currentlyInfectedSevere * normalisedTimeFactor;

  const SCBRTN = Math.floor(infectionsByRequestedTimeNormal * 0.15);
  const SCBRTS = Math.floor(infectionsByRequestedTimeSevere * 0.15);
  const severeCasesByRequestedTimeNormal = SCBRTN;
  const severeCasesByRequestedTimeSevere = SCBRTS;

  const HBBRTN = Math.floor((totalHospitalBeds * 0.35) - SCBRTN);
  const hsptlBedsByRqstdTimeNormal = HBBRTN;
  const HBBRTS = Math.floor((totalHospitalBeds * 0.35) - SCBRTS);
  const hsptlBedsByRqstdTimeSevere = HBBRTS;

  const IBRTN = infectionsByRequestedTimeNormal;
  const IBRTS = infectionsByRequestedTimeSevere;
  const AVDIU = avgDailyIncomeInUSD;
  const AVDIP = avgDailyIncomePopulation;

  const dollarsInFlightNormal = Math.floor(IBRTN * AVDIU * (AVDIP / 30));
  const dollarsInFlightSevere = Math.floor(IBRTS * AVDIU * (AVDIP / 30));

  return {
    data,
    impact: {
      currentlyInfected: currentlyInfectedNormal,
      infectionsByRequestedTime: infectionsByRequestedTimeNormal,
      severeCasesByRequestedTime: severeCasesByRequestedTimeNormal,
      hospitalBedsByRequestedTime: hsptlBedsByRqstdTimeNormal,
      casesForICUByRequestedTime: Math.floor(infectionsByRequestedTimeNormal * 0.05),
      casesForVentilatorsByRequestedTime: Math.floor(infectionsByRequestedTimeSevere * 0.02),
      dollarsInFlight: dollarsInFlightNormal
    }, // best case estimation
    severeImpact: {
      currentlyInfected: currentlyInfectedSevere,
      infectionsByRequestedTime: infectionsByRequestedTimeSevere,
      severeCasesByRequestedTime: severeCasesByRequestedTimeSevere,
      hospitalBedsByRequestedTime: hsptlBedsByRqstdTimeSevere,
      casesForICUByRequestedTime: Math.floor(infectionsByRequestedTimeSevere * 0.05),
      casesForVentilatorsByRequestedTime: Math.floor(infectionsByRequestedTimeSevere * 0.02),
      dollarsInFlight: dollarsInFlightSevere

    } // severe case estimation
  };
};

export default covid19ImpactEstimator;
