"use client";
import React, { useState } from "react";
import {
  Box,
  Flex,
  Button,
  Textarea,
  Link as ChakraLink,
} from "@chakra-ui/react";
import styles from './page.module.css'
import beaverLogo from '/docs/images/beaver-logo.svg'
import Image from 'next/image'
import NextLink from "next/link";


export default function Waiver() {

  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
  const [incompleteClick, setIncompleteClick] = useState(false)

  const onIncompleteClick = () => { //this will just add a message telling them to 
    setIncompleteClick(true)        //read the entire waiver if they try to click continue
  }

  //This makes sure they've scrolled through the entire waiver
  const handleTextareaScroll = (event: React.UIEvent<HTMLElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    if(isScrolledToBottom == false){
      setIsScrolledToBottom(scrollTop + clientHeight + 50 >= scrollHeight);
      setIncompleteClick(false);
    }
  };

  const waiverText = `1. I am voluntarily joining an activity sponsored by the SLO Beaver Brigade, which may include tours to and from and in and around beaver ponds, as well as litter and brush removal or planting in riverbeds and creekbeds, and related activities.
  
  2. I understand that the SLO Beaver Brigade has no duty or responsibility for me or my dependents’ safety or property. I am participating in this activity entirely at my own risk and assume full responsibility for any and all bodily injury, disability, death, or property damage as a result of my participation in a SLO Beaver Brigade event. I recognize that these risks may include hiking, crossing streams or wading through water, falling trees and limbs, poison oak, stinging nettles, thistles and other barbed plants, poisonous insects, snakes including rattlesnakes, ticks, wild animals, inclement weather, wildfires or floods, homeless encampments, sharp objects in and around the riverbed such as barbed wire, unsupervised dogs or horses, ATV riders, dirt bikers or other vehicles, hunters, target shooters, poachers, and any other risks on or around the premises of the activity, known or unknown to me or event organizers and leaders.
  
  3. I hereby RELEASE, WAIVE, and DISCHARGE the SLO Beaver Brigade, Dr. Emily Fairfax, Audrey Taub, Cooper Lienhart, Kate Montgomery, Fred Frank, Hannah Strauss, landowners, and Beaver Brigade interns/fellows, volunteers, members, sponsors, affiliates and other agents from any and all liability, claims, demands and actions whatsoever, regardless of whether such loss is caused by the acts or failures to act of any party organizing or leading a specific event or activity on behalf of the SLO Beaver Brigade, and I surrender any and all rights to seek compensation for any injury whatsoever sustained during my participation in a SLO Beaver Brigade activity. I agree to INDEMNIFY and HOLD HARMLESS releases against any and all claims, suits, or actions brought by me, my spouse, family, heirs, or anyone else on behalf of me or my dependents, and agree to reimburse all attorney’s fees and related costs that may be incurred by releases due to my participation in SLO Beaver Brigade events or activities.
  
  4. I hereby grant the SLO Beaver Brigade permission to use my likeness in a photograph, video, or other digital media (“photo”) in any and all of its publications, including web-based publications, without payment or other consideration. I hereby irrevocably authorize the SLO Beaver Brigade to edit, alter, copy, exhibit, publish, or distribute these photos for any lawful purpose. In addition, I waive any right to inspect or approve the finished product wherein my likeness appears. Additionally, I waive any right to royalties or other compensation arising from or related to the use of the photo.
  
  BY SIGNING THIS AGREEMENT, I ACKNOWLEDGE AND REPRESENT THAT I HAVE READ THIS WAIVER OF LIABILITY AND HOLD HARMLESS AGREEMENT, that I fully understand and consent to the terms of this agreement, and that I am signing it of my own free will. I agree that no oral representations, statements, or inducements apart from this written agreement have been made or implied. I am at least 18 years of age, fully competent, responsible, and legally able to sign this agreement for myself or my dependents.`
    return (
      <div>
      <Flex flexDirection="column" justifyContent="flex-start" alignItems="center" 
        height="100vh" marginTop="5vh">
        <Image src={beaverLogo} alt="beaver"/>
        <Box w="65%" h="50%" mt={20}>
          <h1 style={{ fontSize: "30px", fontWeight: "bold" } }>Waiver of Liability and Hold Harmless Agreement</h1>
          <Textarea className={styles.scroller} resize="none" readOnly height="75%" whiteSpace="pre-line" mt={5}
            value={waiverText} onScroll={handleTextareaScroll}>
          </Textarea>
        </Box>
        <Flex flexDirection="row">
          <NextLink href = "/">
            <Button sx={{ width: '225px', height: '40px', marginLeft: '75px', marginRight: '75px',
            backgroundColor: 'white', border: '2px solid #B5B5B5', color: '#B5B5B5',
            borderRadius: '10px', '&:hover': { backgroundColor: 'gray.200', border: '2px solid gray.200' }
            }}>Return</Button>
           </NextLink>
          {!isScrolledToBottom && 
          <Button onClick={onIncompleteClick} sx={{ width: '225px', height: '40px', marginLeft: '75px', marginRight: '75px',
           backgroundColor: 'white', border: '2px solid #B5B5B5', color: '#B5B5B5',
           borderRadius: '10px', 
           '&:hover':{ backgroundColor: 'white', border: '2px solid gray.200' } 
           }}>Continue</Button>
          }
          {isScrolledToBottom && 
          <NextLink href = "./2">
            <Button sx={{ width: '225px', height: '40px', marginLeft: '75px', marginRight: '75px',
            backgroundColor: '#337774', border: '2px solid #337774', color: 'white',
            borderRadius: '10px', 
            '&:hover':{ backgroundColor: '#296361', border: '2px solid #296361' } 
            }}>Continue</Button>
           </NextLink>
          }
        </Flex>
        {incompleteClick && <div style={{color: '#c45e76', marginLeft: '25%', marginTop: '10px'}}>Finish reading the liability waiver to continue</div>}
      </Flex>
      </div>
    )
  }
  