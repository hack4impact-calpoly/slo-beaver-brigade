"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Button,
} from "@chakra-ui/react";
import styles from './page.module.css'
import beaverLogo from '/docs/images/beaver-logo.svg'
import Image from 'next/image'
import NextLink from "next/link";



export default function Waiver() {
  const [dependents, setDependents] = useState(['']); //Used to store added dependents
  const [formFilled, setFormFilled] = useState(false);
  const [email, setEmail] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [signature, setSignature] = useState('');

  useEffect(() => {
    // Check if all required fields are filled
    const isFilled = email.trim() !== '' && zipcode.trim() !== '' && signature.trim() !== '';
    setFormFilled(isFilled);
  }, [email, zipcode, signature]);

  const addDependent = () => {
    const emptyFieldCount = dependents.filter(dependent => dependent === '').length;
    console.log(emptyFieldCount)
    if(emptyFieldCount <= 1){
      setDependents([...dependents, '']);
    }               
  };

  const handleDependentChange = (index: number, value: string) => {
    const newDependents = [...dependents];
    newDependents[index] = value; 
    setDependents(newDependents);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    //For later implementation
  };

  return (
    <div>
      <Flex flexDirection="column" justifyContent="flex-start" alignItems="center" 
        height="100vh" marginTop="5vh">
        <Image src={beaverLogo} alt="beaver"/>
        <Box w="50%" h="45%" mt={20} mb='2.7%' padding='1vw' overflow="auto">
          <h1 style={{ fontSize: "30px", fontWeight: "bold" } }>Add Members</h1>
          <form onSubmit={handleSubmit}>
          <h2 className={styles.formHeading}>Contact Information</h2>
          <input className={styles.inputForm} type="email" id="email" name="email" 
          placeholder="Email" onChange={(e) => setEmail(e.target.value)} required/>
          <input className={styles.inputZipcode} type="zipcode" id="zipcode" name="zipcode" 
          placeholder="Zipcode" onChange={(e) => setZipcode(e.target.value)} required/>
          <table>
            <tbody>
            {dependents.map((name, index) => (
              <tr key={index}>
                <td>
                  <input
                    className={styles.dependentTable}
                    type="text"
                    value={name}
                    onChange={(event) => handleDependentChange(index, event.target.value)}
                    style={{ display: index === 0 ? 'none' : 'block'}}
                    placeholder="Dependent Full Name"
                  />
                </td>
              </tr>
            ))}
            </tbody>
          </table>
            <button type="button" onClick={addDependent} 
            className={styles.addDependent} style={{color: '#ECB94A'}}>
              Add Dependent +
            </button>
            <h2 className={styles.formHeading}>Sign Here</h2>
            <input className={styles.inputSignature} type="string" id="signature" name="signature" 
            placeholder="Signature"onChange={(e) => setSignature(e.target.value)} required/>
          </form>
        </Box>
        <Flex flexDirection="row">
          <NextLink href = "/waiver">
            <Button sx={{ width: '225px', height: '40px', marginLeft: '75px', marginRight: '75px',
            backgroundColor: 'white', border: '2px solid #B5B5B5', color: '#B5B5B5',
            borderRadius: '10px', '&:hover': { backgroundColor: 'gray.200', border: '2px solid gray.200' }
            }}>Return</Button>
           </NextLink>
          { !formFilled &&
            <Button sx={{ width: '225px', height: '40px', marginLeft: '75px', marginRight: '75px',
            backgroundColor: 'white', border: '2px solid #B5B5B5', color: '#B5B5B5',
            borderRadius: '10px', 
            '&:hover':{ backgroundColor: 'white', border: '2px solid gray.200' } 
            }}>Continue</Button>
          }
          {
            formFilled && 
            <NextLink href = "/">
              <Button sx={{ width: '225px', height: '40px', marginLeft: '75px', marginRight: '75px',
              backgroundColor: '#337774', border: '2px solid #337774', color: 'white',
              borderRadius: '10px', 
              '&:hover':{ backgroundColor: '#296361', border: '2px solid #296361' } 
              }}>Continue</Button>
           </NextLink>
          }
          
        </Flex>
      </Flex>
    </div>
  );
}
  