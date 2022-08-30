import { convertFromYocto, getMediaUrl } from '../near/utils';
import { facilityTypeConfig, statusConfig } from '../near/content';
import { Link } from '../assets/styles/common.style';

export const OneFacility = ({ facility, size }) => {

  return (
    <Link className="relative flex flex-row py-4 last:border-b-0 w-full"
          to={`/facility/${facility.token_id}`}>
      <img src={getMediaUrl(facility.media)} className="facility-image rounded-xl mr-6 mt-4 xl:mt-0" alt="photo" />
      <div className="w-full">
        <span className="absolute right-4 top-4 bg-sky-100 px-2 py-1 text-sky-700 font-medium text-sm rounded">
          {statusConfig[facility.status]}
        </span>

        <h4 className="text-lg font-medium whitespace-nowrap text-ellipsis overflow-hidden facility-title">
          {facility.title}
        </h4>

        <div className={`text-sm text-gray-600 block 
          ${size === 'small' ? "" : "xl:flex xl:flex-row"}
        `}>
          <div className="w-64">
            <p>{facilityTypeConfig[facility.facility_type]}</p>
            {facility.total_invested > 0 && (
              <div className="mt-4">
                <p>Total Invested: <b className="font-medium">{convertFromYocto(facility.total_invested, 1)} NEAR</b></p>
                <p>Investors: <b>{facility.total_investors}</b></p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
