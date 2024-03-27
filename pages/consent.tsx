import { useCallback, useState } from 'react'
import { Box, Text, Heading, Checkbox, Button } from '@chakra-ui/react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useDB } from '../contexts/DatabaseContext'

const ConsentFrom = ({ onStatusChange }) => {
  const [isChecked, setIsChecked] = useState(false)

  const handleCheckboxChange = () => setIsChecked(!isChecked)

  const changeGame = useCallback(() => {
    onStatusChange.on(true)
  }, [onStatusChange.on])

  const { handleAnonSignIn } = useAuth()
  const { setData } = useDB()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      setLoading(true)
      const uid = await handleAnonSignIn()
      await setData(uid)
      navigate('/')
    } catch (e) {
      console.log('RIP', e)
    }
    setLoading(false)
    changeGame()
  }

  // const handleShuffleStart = () => {
  //   handleSubmit()
  //   changeGame()
  // }

  return (
    <Box id="consent" p="2">
      <Text p="1">IRB Study #2001686712</Text>
      <Heading size="lg" py="2">
        INDIANA UNIVERSITY STUDY INFORMATION SHEET FOR RESEARCH
      </Heading>
      <Heading size="md" py="2">
        Cognition and Decision Making
      </Heading>
      <Text p="1">
        You are invited to participate in a research study that examines how
        what we have learned can influence how people think, act, and make
        decisions. You were selected as a possible subject because you are a
        member of the Psychology Subject Pool. We ask that you read this form
        and ask any questions you may have before agreeing to be in the study.
      </Text>
      <Text p="1">
        The study is being conducted by Dr. Robert Goldstone in the Department
        of Psychological and Brain Sciences.
      </Text>
      <Heading size="sm" py="2">
        STUDY PURPOSE
      </Heading>
      <Text p="1">
        The purpose of this study is to better understand the way that people
        see objects can change as they learn new tasks.
      </Text>
      <Heading size="sm" py="2">
        NUMBER OF PEOPLE TAKING PART IN THE STUDY
      </Heading>
      <Text p="1">
        If you agree to participate, you will be one of approximately 5000
        subjects who will be participating in this research.
      </Text>
      <Heading size="sm" py="2">
        PROCEDURES FOR THE STUDY
      </Heading>
      <Text p="1">
        If you agree to be in the study, you will be seated at a computer
        monitor. You will be presented with several straightforward tasks to
        complete. These tasks will include responding with key strokes to
        stimuli (e.g., images, videos, words, sounds) displayed on a computer
        monitor and may involve learning what categories objects belong in,
        determining if objects are identical or related, and remembering or
        transferring what you learn about objects in one training task to a
        related task. The experiment will take up to 120 minutes to complete.{' '}
      </Text>
      <Heading size="sm" py="2">
        RISKS OF TAKING PART IN THE STUDY{' '}
      </Heading>
      <Text p="1">
        Participation in this study involves a potential risk of loss of
        confidentiality. This risk is minimized by the investigator, as outlined
        in the “Confidentiality” section.{' '}
      </Text>
      <Heading size="sm" py="2">
        BENEFITS OF TAKING PART IN THE STUDY
      </Heading>
      <Text p="1">
        An understanding of how people change the way they see the world as they
        learn can help us to find more efficient methods to teach information
        and develop technologies that increase the speed of learning. You
        benefit from this experience because you learn something about how an
        experiment is designed and conducted, what issues are of interest to
        cognitive scientists, and what kinds of group behaviors emerge when
        individuals try to reach their goals in an environment that consists
        largely of other individuals.
      </Text>
      <Heading size="sm" py="2">
        ALTERNATIVES TO TAKING PART IN THE STUDY
      </Heading>
      <Text p="1">
        Instead of being in the study, you have these options: Not being in the
        study, or your professor can provide you with other ways to gain course
        credit (such as writing a paper) if you choose not to participate in
        experiments.{' '}
      </Text>
      <Heading size="sm" py="2">
        CONFIDENTIALITY
      </Heading>
      <Text p="1">
        Efforts will be made to keep your personal information confidential. We
        cannot guarantee absolute confidentiality. Your personal information may
        be disclosed if required by law. Your identity will be held in
        confidence in reports in which the study may be published and in
        databases in which results may be stored. Organizations that may inspect
        and/or copy your research records for quality assurance and data
        analysis include groups such as the study investigator and his/her
        research associates, the IUB Institutional Review Board or its
        designees, and (as allowed by law) state or federal agencies,
        specifically the Office for Human Research Protections (OHRP), etc. who
        may want to access your research records.
      </Text>
      <Heading size="sm" py="2">
        PAYMENT
      </Heading>
      <Text p="1">
        For participating in this study, you will receive 0.5 credits for each
        30 minutes you participate for Psychology 101, 102, or 155. Withdrawal
        prior to the completion of the study will result in no penalty or loss
        of benefits.
      </Text>
      <Heading size="sm" py="2">
        CONTACTS FOR QUESTIONS OR PROBLEMS
      </Heading>
      <Text p="1">
        For questions about the study or a research-related injury, contact the
        researcher Dr. Robert Goldstone at 812-855-4853, or
        rgoldsto@indiana.edu. For questions about your rights as a research
        participant or to discuss problems, complaints or concerns about a
        research study, or to obtain information, or offer input, contact the
        IUB Human Subjects office, 530 E Kirkwood Ave, Carmichael Center, 203,
        Bloomington IN 47408, 812-856-4242 or by email at irb@iu.edu
      </Text>
      <Heading size="sm" py="2">
        VOLUNTARY NATURE OF STUDY
      </Heading>
      <Text p="1">
        Taking part in this study is voluntary. You may choose not to take part
        or may leave the study at any time. Leaving the study will not result in
        any penalty or loss of benefits to which you are entitled. Your decision
        whether or not to participate in this study will not affect your current
        or future relations with the investigator(s).
      </Text>
      <Heading size="sm" py="2">
        SUBJECT'S CONSENT
      </Heading>
      <Text p="1">
        By checking below, you acknowledge that you have read and understand the
        above information, the you are 18 years of age or older, and give your
        consent to participate in our internet-based study.
      </Text>
      <Box display="flex">
        <Checkbox
          onChange={handleCheckboxChange}
          borderColor={'#000'}
          id="consent_checkbox"
        />
        <Text p="1">I agree to take part in this study</Text>
      </Box>
      <Text p="1">Print this page if you want a copy for your records.</Text>
      <Text p="1">Form date: January 8, 2020</Text>
      <Heading size="sm" py="2">
        Protocol 2001686712 IRB Approved
      </Heading>
      <Button
        onClick={handleSubmit}
        isDisabled={!isChecked || loading}
        _hover={{ bg: '#777' }}
        bg="#000"
        type="button"
        id="start"
      >
        Start Experiment
      </Button>
    </Box>
  )
}

export default ConsentFrom
