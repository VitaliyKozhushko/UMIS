import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import CardItem from '../components/CardItem';
import patient from '../assets/scss/listPatients.module.scss';
import {fetchPatients} from "../store/patientsSlice";
import {RootState, AppDispatch} from '../store';
import {Button} from '@mantine/core';
import {useNavigate} from "react-router-dom";
import {updateOffline, getOffline} from '../store/configSlice';

function ListPatient() {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const {patients, loading, error} = useSelector((state: RootState) => state.patients);
  const offline = useSelector((state: RootState) => state.config.offline);

  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [variantOfflineBtn, setVariantOfflineBtn] = useState<string>('light');
  const [loadingOffline, setLoadingOffline] = useState<boolean>(false);

  useEffect(() => {
    setLoadingOffline(true)
    dispatch(fetchPatients());
    dispatch(getOffline())
    setLoadingOffline(false)
  }, [dispatch]);

  useEffect(() => {
    setVariantOfflineBtn(offline ? 'filled' : 'light')
  }, [offline]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  function handleLogout() {
    localStorage.removeItem('loginTime');
    navigate('/')
  }

  function toggleCard(id: number) {
    setActiveCard((prev) => (prev === id ? null : id));
  }

  function handleOffline() {
    setLoadingOffline(true)
    dispatch(updateOffline(!offline));
    setLoadingOffline(false)
  }

  return (
    <div className={patient.page}>
      <div className={patient.actionBtnBlock}>
        <Button variant="filled" onClick={handleLogout}>Выход</Button>
        <Button loading={loadingOffline} variant={variantOfflineBtn} color='red' onClick={handleOffline}>Offline</Button>
      </div>
      <div className={patient.listBlock}>
        {patients.map((patient) => (
          <CardItem
            key={patient.id}
            mainCss='patient'
            data={patient}
            isOpen={activeCard === patient.id}
            onToggle={() => toggleCard(patient.id)}/>
        ))}
      </div>
    </div>
  )
}

export default ListPatient