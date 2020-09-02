import React from 'react';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import NextLink from 'next/link';
import { useDeletePostMutation, useMeQuery } from '../generated/graphql';

interface EditDeletePostButtonsProps {
  id: number;
  creatorId: number;
}

export const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({
  id,
  creatorId,
}) => {
  const { data: meData } = useMeQuery();
  const [deletePost] = useDeletePostMutation();

  if (meData?.me?.id !== creatorId) {
    return null;
  }

  return (
    <Box>
      <NextLink href='/post/edit/[id]' as={`/post/edit/${id}`}>
        <IconButton /*icon='edit'*/ aria-label='Edit Post' />
      </NextLink>
      <IconButton
        // icon='delete'
        aria-label='Delete Post'
        onClick={() => {
          deletePost({
            variables: { id },
            update: (cache) => {
              // Post:77
              cache.evict({ id: 'Post:' + id });
            },
          });
        }}
      />
    </Box>
  );
};
