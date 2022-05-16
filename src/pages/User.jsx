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
  const [userFacilities, setUserFacilities] = useState("");

  // Register performer form
  const [performerName, setPerformerName] = useState("");
  const [performerPhone, setPerformerPhone] = useState("");
  const [performerDescription, setPerformerDescription] = useState("");
  // const logoInput = React.createRef();
  // const [performerLogo, setPerformerLogo] = useState("");

  const loadUserFacilities = async () => {
    const facilities = await window.contract.get_investor_facilities({
      account_id: currentUser.id
    });
    setUserFacilities(facilities);
    setIsReady(true);
  }

  useEffect(() => {
    loadUserFacilities();
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

  const InfoField = ({ title, value, newLine, valueClass }) => (
    <div className={`mb-2 ${newLine ? "" : "flex flex-row"}`}>
      <div className="font-medium w-36">{title}:</div>
      <div className={valueClass}>{value}</div>
    </div>
  );

  return (
    <>
      <Wrapper>
        <Header color="dark" />

        <Container className="mt-4">
          <div className="flex flex-row mt-8">
            <div className="w-2/3 border-r pr-10">
              <h3 className="text-xl font-semibold mb-4 pl-4">My Investments</h3>
              {isReady ? (
                <div>
                  {userFacilities.length > 0 ?
                    userFacilities.map(facility => (
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
            <div className="w-1/3 ml-10">
              <h3 className="text-xl font-semibold mb-4">Performer Account</h3>

              {currentUser.performer ? (
                <div className="mt-8">
                  <InfoField title="Company Name"
                             value={currentUser.performer.name} />
                  <InfoField title="Phone"
                             value={currentUser.performer.phone} />
                  <InfoField title="Description"
                             value={currentUser.performer.description}
                             valueClass="mt-1"
                             newLine />
                  <InfoField title="Verification"
                             valueClass={`font-medium ${currentUser.performer.is_validated ? "text-green-500" : "text-gray-500"}`}
                             value={currentUser.performer.is_validated ? "Verified" : "Pending"} />
                  {
                    currentUser.performer.rating > 0 && (
                      <InfoField title="Rating (1-10)"
                                 valueClass={`font-medium ${currentUser.performer.rating > 5 ? "text-green-500" : "text-red-500"}`}
                                 value={currentUser.performer.rating} />
                    )}

                </div>
              ) : (
                <form onSubmit={registerPerformer}>
                  <div className="text-gray-500 text-sm">
                    To start work on the restoration of cultural heritage, you need to provide additional information
                    about the company (or private entrepreneur) and pass verification.
                    Your request requires 0.1 NEAR for this verification.
                  </div>
                  <div className="mt-6">
                    <div className="mb-3">
                      <FormLabel>Company Name<sup className="text-red-400">*</sup></FormLabel>
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
                      <FormLabel>Phone<sup className="text-red-400">*</sup></FormLabel>
                      <FormInput type="text"
                                 value={performerPhone}
                                 placeholder="+380"
                                 onChange={(e) => setPerformerPhone(e.target.value)} />
                    </div>
                    <div className="mb-3">
                      <FormLabel>Description<sup className="text-red-400">*</sup></FormLabel>
                      <FormTextarea value={performerDescription}
                                    placeholder="Describe your experience, sphere of activity and works."
                                    onChange={(e) => setPerformerDescription(e.target.value)}>
                      </FormTextarea>
                    </div>
                    <div className="text-right">
                      <Button title="Create Account" />
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
