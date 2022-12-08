import React from 'react';
import gif from '../assets/loading.gif'
import {styled} from '@mui/material/styles';

const LoadingContainer = styled('div')(({theme}) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center"
}));

const Img = styled('img')(({theme}) => ({
  height: "65px"
}));


// show a button with loading gif when action in progress
export default function LoadingGif({addContainer = true}) {

  if (addContainer) {
    return (
      <LoadingContainer>
        <Img src={gif} alt="Chargement..." />
      </LoadingContainer>
    )
  }
  return <Img src={gif} alt="Chargement..." />
}
