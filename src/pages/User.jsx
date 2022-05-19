import React, { useEffect, useState } from "react";
import { Header } from '../components/Header';
import { Container, FormInput, FormLabel, FormTextarea, Link, Wrapper } from '../assets/styles/common.style';
import { useSelector } from 'react-redux';
import { Button } from '../components/basic/Button';
import { convertToTera, convertToYocto } from '../near/utils';
import { OneFacility } from '../components/OneFacility';
import { Loader } from '../components/basic/Loader';

export const User = () => {
  const currentUser = useSelector(state => state.user.account);
  const [isReady, setIsReady] = useState(false);
  const [investorFacilities, setInvestorFacilities] = useState([]);
  const [performerFacilities, setPerformerFacilities] = useState([]);

  // Register performer form
  const [performerName, setPerformerName] = useState("");
  const [performerPhone, setPerformerPhone] = useState("");
  const [performerDescription, setPerformerDescription] = useState("");
  // const logoInput = React.createRef();
  // const [performerLogo, setPerformerLogo] = useState("");

  const loadInvestorFacilities = async () => {
    const facilities = await window.contract.get_investor_facilities({
      account_id: currentUser.id
    });
    setInvestorFacilities(facilities);
    setIsReady(true);
  }

  const loadPerformerFacilities = async () => {
    const facilities = await window.contract.get_performer_facilities({
      account_id: currentUser.id
    });
    setPerformerFacilities(facilities);
  }

  useEffect(() => {
    loadInvestorFacilities();
    loadPerformerFacilities();
  }, [currentUser]);

  const registerPerformer = async (event) => {
    event.preventDefault();
    if (performerName.length < 3) {
      alert("Please fill Company Name")
    } else if (performerPhone.length < 6) {
      alert("Please fill Company Phone")
    } else if (performerDescription.length < 10) {
      alert("Please fill Description")
    } else {
      await window.contract.create_performer_account({
        name: performerName,
        phone: performerPhone,
        description: performerDescription,
      }, convertToTera("80"), convertToYocto("0.1"));
    }
  }

  const InfoField = ({ title, value, valueClass }) => (
    <div className={`mb-2 flex flex-row`}>
      <div className="font-medium w-36">{title}:</div>
      <div className={`w-3/4 ${valueClass}`}>
        {value}
      </div>
    </div>
  );

  return (
    <>
      <Wrapper>
        <Header color="dark" />

        <Container className="mt-4">
          <div className="flex flex-row mt-8">

            <div className="w-7/12 border-r pr-10">
              <h3 className="text-xl font-semibold mb-4 pl-4 pt-2">My Investments</h3>
              {isReady ? (
                <div>
                  {investorFacilities.length > 0 ?
                    investorFacilities.map(facility => (
                      <div className="transition hover:bg-gray-50 pl-4 border-b border-dashed last:border-b-0"
                           key={facility.token_id}>
                        <OneFacility facility={facility} />
                      </div>
                    )) : (
                      <div className="text-gray-500 pl-4">*No investments</div>
                    )}
                </div>
              ) : (
                <Loader />
              )}
            </div>

            <div className="w-5/12 ml-10">
              <h3 className="mb-4 flex flex-row justify-between font-semibold">
                <span className="text-xl pt-2">Performer Account</span>
                {currentUser.performer && (
                  <>
                    <div className={`text-sm border rounded-lg px-4 py-2
                    ${currentUser.performer.is_validated ? "bg-green-100" : "bg-gray-50"}`}>
                      Verification:
                      {currentUser.performer.is_validated ? (
                        <span className="text-green-500 ml-2">Verified</span>
                      ) : (
                        <span className="text-gray-500 ml-2">Pending</span>
                      )}
                    </div>
                  </>
                )}
              </h3>

              {currentUser.performer && !currentUser.performer.is_validated && (
                <p className="text-sm text-red-500 font-medium">
                  Please wait, your account will be verified for greater investor confidence.
                </p>
              )}

              {currentUser.performer ? (
                <div className="mt-6">
                  <InfoField title="Company Name"
                             value={currentUser.performer.name} />
                  <InfoField title="Phone"
                             value={currentUser.performer.phone} />
                  <InfoField title="Description"
                             value={currentUser.performer.description} />
                  {
                    currentUser.performer.rating > 0 && (
                      <InfoField title="Rating (1-10)"
                                 valueClass={`font-medium ${currentUser.performer.rating > 5 ? "text-green-500" : "text-blue-500"}`}
                                 value={currentUser.performer.rating} />
                    )}
                  <hr className="my-6" />

                  <h3 className="text-lg font-medium pt-2">My Facilities</h3>
                  <div className="pb-6">
                    {performerFacilities.length > 0 ?
                      performerFacilities.map(facility => (
                        <div className="transition hover:bg-gray-50 border-b border-dashed last:border-b-0"
                             key={facility.token_id}>
                          <OneFacility facility={facility} size="small" />
                        </div>
                      )) : (
                        <div className="text-gray-500 mt-4">*No facilities</div>
                      )}
                  </div>
                </div>
              ) : (
                <form onSubmit={registerPerformer} className="max-w-[480px]">
                  <div className="text-gray-500 text-sm">
                    To start work on the restoration of cultural heritage, you need to provide additional information
                    about the company (or private entrepreneur).
                  </div>
                  <div className="mt-6">
                    <div className="mb-3">
                      <FormLabel>Company Name<sup className="text-blue-400">*</sup></FormLabel>
                      <FormInput type="text"
                                 value={performerName}
                                 onChange={(e) => setPerformerName(e.target.value)} />
                    </div>
                    {/*<div className="mb-3">*/}
                    {/*  <FormLabel>Company Logo:</FormLabel>*/}
                    {/*  <FormInput type="file"*/}
                    {/*             ref={logoInput}*/}
                    {/*             onChange={() => uploadImage()}/>*/}
                    {/*</div>*/}
                    <div className="mb-3">
                      <FormLabel>Phone<sup className="text-blue-400">*</sup></FormLabel>
                      <FormInput type="text"
                                 value={performerPhone}
                                 placeholder="+380"
                                 onChange={(e) => setPerformerPhone(e.target.value)} />
                    </div>
                    <div className="mb-3">
                      <FormLabel>Description<sup className="text-blue-400">*</sup></FormLabel>
                      <FormTextarea value={performerDescription}
                                    placeholder="Describe your experience, sphere of activity and works."
                                    onChange={(e) => setPerformerDescription(e.target.value)}>
                      </FormTextarea>
                    </div>
                    <div className="flex flex-row">
                      <div className="w-1/2 text-sm text-gray-500">
                        *Your request requires 0.1 NEAR for this verification.
                      </div>
                      <div className="text-right w-1/2">
                        <Button title="Create Account" noIcon />
                      </div>

                    </div>
                  </div>
                </form>
              )}

            </div>
          </div>
        </Container>

      </Wrapper>

    </>
  );
};
