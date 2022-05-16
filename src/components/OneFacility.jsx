import { convertFromYocto, getMediaUrl } from '../near/utils';
import { facilityTypeConfig, statusConfig } from '../near/content';
import { Link } from '../assets/styles/common.style';

export const OneFacility = ({ facility }) => {

  return (
    <Link className="relative flex flex-row py-4 last:border-b-0"
          to={`/facility/${facility.token_id}`}>
      <img src={getMediaUrl(facility.media)} alt="" className="facility-image rounded-xl mr-6" />
      <div>
        <h4 className="text-lg font-medium my-2 whitespace-nowrap text-ellipsis overflow-hidden facility-title">
          {facility.title}
        </h4>
        <div className="text-sm text-gray-600 flex flex-row">
          <div className="w-48">
            <p>Status: {statusConfig[facility.status]}</p>
            <p>Type: {facilityTypeConfig[facility.facility_type]}</p>
          </div>
          <div>
            {facility.total_invested > 0 && (
              <>
                <p>Total Invested: {convertFromYocto(facility.total_invested, 1)} NEAR</p>
                {/*<p>My investments: {facility.total_invested} NEAR</p>*/}
                <p>Proposals: {facility.total_investors}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
