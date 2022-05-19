import { convertFromYocto, getMediaUrl } from '../near/utils';
import { facilityTypeConfig, statusConfig } from '../near/content';
import { Link } from '../assets/styles/common.style';

export const OneFacility = ({ facility, size }) => {

  return (
    <Link className="relative flex flex-row py-4 last:border-b-0"
          to={`/facility/${facility.token_id}`}>
      <img src={getMediaUrl(facility.media)} className="facility-image rounded-xl mr-6 mt-4 xl:mt-0" alt="photo" />
      <div>
        <h4 className="text-lg font-medium mb-2 xl:mb-2 whitespace-nowrap text-ellipsis overflow-hidden facility-title">
          {facility.title}
        </h4>
        <div className={`text-sm text-gray-600 block 
          ${size === 'small' ? "" : "xl:flex xl:flex-row"}
        `}>
          <div className="w-48">
            <p className="mb-0.5">{facilityTypeConfig[facility.facility_type]}</p>
            <p>Status: {statusConfig[facility.status]}</p>
          </div>
          <div className={`${size === 'small' ? "" : "pl-8"}`}>
            {facility.total_invested > 0 && (
              <>
                <p className="mb-0.5">Total Invested: <b>{convertFromYocto(facility.total_invested, 1)} NEAR</b></p>
                <p>Investors: <b>{facility.total_investors}</b></p>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
