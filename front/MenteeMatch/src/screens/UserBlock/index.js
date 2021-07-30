import React, { useEffect, useRef, useState } from 'react';
import { Tooltip, Text as ToltipText } from 'react-native-elements';
import { Text, View, Image } from 'react-native';
import { Button } from 'react-native-elements';
import { styles } from './styles';
import user_img from '../../assets/static/user_img.png';
import SpinnerCoincidence from '../../components/SpinnerCoincidence';
import useMode from '../../hooks/useMode';
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert';

export default function UserBlock({
  user,
  userLogin,
  handleLike,
  enableTooltip,
  handleDislike,
  disableButtons,
}) {
  const skills = user.isMentor ? user.skillsToTeach : user.skillsToLearn;
  const [show, setShow] = useState(false);
  const tooltipRef = useRef(null);

  const getPopMessage = () => {
    return user.isMentor
      ? `¿Quieres confirmar a ${user.name} ${user.surname} cómo tu mentor?`
      : `¿Quieres invitar a ${user.name} ${user.surname} a ser tu mentee?`;
  };

  const handleOpen = () => {
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
  };

  useEffect(() => {
    if (enableTooltip) {
      setTimeout(() => {
        tooltipRef.current.toggleTooltip();
        setTimeout(() => {
          tooltipRef.current.toggleTooltip();
        }, 3000);
      }, 2000);
    }
  }, [enableTooltip]);

  const { mode } = useMode();
  return (
    <View style={styles.container}>
      {user._id ? (
        <View
          style={{
            ...styles.block,
            backgroundColor: mode.inputBg,
            borderColor: mode.inputBg,
          }}>
          <View style={styles.rowDirection}>
            <Image
              style={{ ...styles.img, borderColor: mode.violet }}
              source={user.img ? { uri: user.img } : user_img}
            />
            <View style={styles.cardTitleBox}>
              <View>
                <Text
                  style={{
                    ...styles.title,
                    color: mode.violet,
                  }}>
                  {user.name} {user.surname}
                </Text>
                <Text style={{ ...styles.text, color: mode.text }}>
                  {user.email}
                </Text>
              </View>
            </View>
            {disableButtons && (
              <>
                <Tooltip
                  width={100}
                  height={60}
                  ref={tooltipRef}
                  popover={
                    <ToltipText>Presiona acá para confirmar</ToltipText>
                  }>
                  <Button
                    buttonStyle={[styles.likeButton, styles.confirmButton]}
                    title="✔"
                    onPress={() => handleOpen()}
                  />
                </Tooltip>
                <SCLAlert
                  show={show}
                  onRequestClose={handleClose}
                  theme="success"
                  title="¡Perfecto!"
                  titleStyle={{
                    color: mode.text,
                  }}
                  subtitleStyle={{
                    color: mode.text,
                  }}
                  innerStyle={{
                    backgroundColor: mode.bg,
                  }}
                  headerContainerStyles={{
                    backgroundColor: mode.bg,
                  }}
                  subtitle={getPopMessage()}>
                  <SCLAlertButton theme="info" onPress={() => handleLike(user)}>
                    Confirmar
                  </SCLAlertButton>
                  <SCLAlertButton theme="default" onPress={handleClose}>
                    Cancelar
                  </SCLAlertButton>
                </SCLAlert>
              </>
            )}
          </View>

          <View style={styles.skillsContainer}>
            <Text style={{ ...styles.skills, color: mode.text }}>
              •
              {skills.map(skill => (
                <Text key={skill._id}> {skill.name} •</Text>
              ))}
            </Text>
          </View>

          {!disableButtons && (
            <View style={styles.buttonsContainer}>
              <Button
                buttonStyle={styles.dislikeButton}
                title="Descartar"
                onPress={() => handleDislike(user)}
              />

              <View style={styles.spinnerContainer}>
                <SpinnerCoincidence mentorSkills={user} userLogin={userLogin} />
                <Text style={{ color: mode.text }}>Coincidencias</Text>
              </View>

              <Button
                buttonStyle={styles.likeButton}
                title="Elegir"
                onPress={() => handleLike(user)}
              />
            </View>
          )}
        </View>
      ) : null}
    </View>
  );
}
