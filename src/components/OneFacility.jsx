import { convertFromYocto, getMediaUrl } from '../near/utils';
import { facilityTypeConfig, statusColorMap, statusConfig } from '../near/content';
import { Link } from '../assets/styles/common.style';

export const OneFacility = ({ facility, size }) => {

  return (
    <Link className="relative flex flex-row py-4 bg-white last:border-b-0 w-full shadow-lg rounded-xl p-4 mb-4 border
     transition border-gray-200 hover:bg-gray-50/70"
          to={`/facility/${facility.token_id}`}>
      <img src={getMediaUrl(facility.media)} className="facility-image rounded-lg mr-6 mt-4 xl:mt-0" alt="photo"/>
      <div className="w-full overflow-hidden">
        <b className="absolute bg-white bottom-2 sm:bottom-4 right-5 text-lg font-medium text-gray-500" title="Invested Total">
          {facility.total_invested > 0 ? convertFromYocto(facility.total_invested, 1) : 0} NEAR
        </b>

        <h4 className="text-base lg:text-lg mt-1 font-medium leading-5 lg:leading-5 overflow-hidden sm:facility-title max-h-[40px] mb-2">
          {facility.title}
        </h4>
        <small className={`px-2 py-1 font-medium text-xsm rounded ${statusColorMap[facility.status]}`}>
          {statusConfig[facility.status]}
        </small>

        <div className={`text-sm mt-3 text-gray-600 block 
          ${size === 'small' ? "" : "xl:flex xl:flex-row"}
        `}>
          <div className="w-64">
            <p>{facilityTypeConfig[facility.facility_type]}</p>
            <p>{facility.total_invested > 0 ? `Investors: ${facility.total_investors}` : "No investors for now"}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};
