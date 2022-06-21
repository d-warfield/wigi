import SharedGroupPreferences from "react-native-shared-group-preferences";
import { reloadAllTimelines } from "react-native-widgetkit";

export const initialState = {
  auth: false,
  profile: {
    userId: "",
  },
  users: [],
  profilePictureUpdatedAt: Date.now(),
  selectedUser: {
    chatId: "",
    friendId: "",
    profile: {
      username: "",
      displayName: "",
    },
  },
  messages: [],
  permissions: {
    notifications: false,
    contacts: false,
    camera: false,
  },
  isKeyboardVisible: false,
  newMessagesAvailable: [],
  typingUsers: [],
};
export const reducer = (state, action) => {
  switch (action.type) {
    case "SET_USER_DETAILS":
      return {
        ...state,
        profile: {
          ...action.payload,
        },
      };
    case "SET_PERMISSIONS":
      return {
        ...state,
        permissions: {
          ...state.permissions,
          ...action.payload,
        },
      };
    case "SET_KEYBOARD_VISIBLE":
      return {
        ...state,
        isKeyboardVisible: action.payload,
      };
    case "EDIT_USER_DETAILS":
      return {
        ...state,
        profile: {
          ...state.profile,
          ...action.payload,
        },
      };
    case "SET_SELECTED_USER":
      return {
        ...state,
        selectedUser: action.payload,
      };
    case "TOGGLE_AUTH":
      return {
        ...state,
        auth: action.payload,
      };
    case "SET_USERS":
      return {
        ...state,
        users: action.payload,
      };
    case "ADD_NEW_USER":
      return {
        ...state,
        users: [action.payload, ...state.users],
        selectedUser: action.payload,
      };
    case "SET_MESSAGES":
      return {
        ...state,
        messages: action.payload,
      };
    case "REMOVE_NEW_MESSAGES_AVAILABLE":
      if (state.profile.userId === action.payload) return state;
      return {
        ...state,
        newMessagesAvailable: state.newMessagesAvailable.filter(
          (userId) => action.payload !== userId
        ),
      };
    case "ADD_NEW_MESSAGES_AVAILABLE":
      if (state.selectedUser?.friendId === action.payload.sender) return state;
      if (action.payload.url) {
        (async () => {
          await SharedGroupPreferences.setItem(
            data.messageReceived.sender,
            {
              name: selectedUser?.displayName || selectedUser?.username,
              imageUrl: data.messageReceived.url,
            },
            appGroupIdentifier
          );
          reloadAllTimelines();
        })();
      }
      return {
        ...state,
        newMessagesAvailable: [
          ...state.newMessagesAvailable,
          action.payload.sender,
        ],
      };
    case "SET_NEW_MESSAGES_AVAILABLE":
      return {
        ...state,
        newMessagesAvailable: action.payload,
      };
    case "SET_TYPING":
      return {
        ...state,
        typingUsers: action.payload.isTyping
          ? [...state.typingUsers, action.payload.sender]
          : state.typingUsers.filter(
              (userId) => action.payload.sender !== userId
            ),
      };
    case "UPDATE_USER_DETAILS":
      return {
        ...state,
        profile: {
          ...state.profile,
          ...action.payload,
        },
      };
    case "UPDATE_SETTINGS":
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
