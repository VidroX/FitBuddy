import 'sendbird-uikit/dist/index.css';

import { useAppSelector } from '../../../../redux';
import { Spinner, useTheme } from '../../../../shared';
import { config } from '../../../../config';
import { SendBirdProvider, ChannelList, Channel } from 'sendbird-uikit';
import { DisabledChatUsersFactory } from '../disabled-chat-group/disabled-chat-group';
import { useState } from 'react';

const ChatApp = () => {
	const user = useAppSelector((state) => state.user.user);
	const [channelUrl, setChannelUrl] = useState<string>('');
	const [queries] = useState<any>({
		channelListQuery: {
			includeEmpty: true,
			order: 'latest_last_message',
		},
	});
	const { theme } = useTheme();

	if (!user) {
		return <Spinner global />;
	}

	return (
		<>
			<SendBirdProvider
				theme={theme}
				userListQuery={DisabledChatUsersFactory}
				colorSet={config.chatColorSet}
				appId={config.sendBird.appId ?? ''}
				nickname={user.firstname + ' ' + user.lastname}
				userId={user._id}
				profileUrl={user.images?.length > 0 ? user.images[0] : ''}
				accessToken={user.chat_access_token ?? ''}>
				<div className="flex flex-1 flex-col md:flex-row h-full">
					<ChannelList
						queries={queries}
						onChannelSelect={(channel) => {
							setChannelUrl(channel?.url ?? '');
						}}
					/>
					<Channel channelUrl={channelUrl} />
				</div>
			</SendBirdProvider>
			<style global jsx>{`
				.sendbird-channel-header__right-icon,
				.sendbird-chat-header__right {
					display: none;
				}

				.sendbird-conversation__messages .sendbird-conversation__messages-padding {
					overflow: auto;
				}

				.sendbird-channel-list {
					width: auto;
					height: auto;
					flex: 1;
				}

				.sendbird-channel-preview,
				.sendbird-channel-header,
				.sendbird-channel-header .sendbird-channel-header__title {
					width: auto;
					min-width: 18rem;
				}

				.sendbird-channel-header {
					padding: 8px;
				}

				.sendbird-place-holder {
					margin: 1rem 0 1rem 0;
				}

				@media (max-width: 767px) {
					.sendbird-channel-list {
						max-height: 25%;
					}

					.sendbird-conversation {
						max-height: calc(75% - 1rem);
						margin-top: 1rem;
					}

					.sendbird-channel-list__body {
						flex: 1;
						overflow-y: auto;
					}
				}
			`}</style>
		</>
	);
};

export default ChatApp;
