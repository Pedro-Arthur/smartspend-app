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
            size="48px"
            source={{
              uri: user.pictureUrl,
            }}
          />
        ) : (
          <Avatar bg="primary.600" mr="1" _text={{ color: 'white' }}>
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
          >
            Outro
          </Text>
        </Pressable>
      </HStack>
    </Box>
  </Box>
);

export default UserAvatarBox;
