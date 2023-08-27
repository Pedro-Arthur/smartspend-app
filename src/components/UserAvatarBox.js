import React from 'react';
import { Box, Text, VStack, HStack, Pressable, Avatar, Spacer } from 'native-base';

const UserAvatarBox = ({ user, changeLoginHeader }) => (
  <Box
    borderWidth={1}
    _dark={{ borderColor: 'light.700' }}
    _light={{ borderColor: 'light.300' }}
    borderRadius={4}
  >
    <Box pl="4" pr="5" py="2">
      <HStack alignItems="center" space={3}>
        {user.pictureUrl ? (
          <Avatar
            size="40px"
            source={{
              uri: user.pictureUrl,
            }}
            accessibilityLabel="Foto de perfil usuário"
            accessibilityRole="image"
          />
        ) : (
          <Avatar
            accessibilityLabel="Foto de perfil usuário"
            accessibilityRole="image"
            size="40px"
            bg="primary.600"
            _text={{ color: 'white' }}
          >
            {user.name.charAt(0)}
          </Avatar>
        )}
        <VStack>
          <Text bold>{user.name}</Text>
          <Text fontSize="xs">{user.email}</Text>
        </VStack>
        <Spacer />

        <Pressable onPress={changeLoginHeader}>
          <Text
            underline
            color="primary.600"
            fontSize="xs"
            fontWeight="medium"
            alignSelf="flex-start"
            accessibilityLabel="Botão para alterar o e-mail pré-carregado"
            accessibilityRole="button"
          >
            Outro
          </Text>
        </Pressable>
      </HStack>
    </Box>
  </Box>
);

export default UserAvatarBox;
