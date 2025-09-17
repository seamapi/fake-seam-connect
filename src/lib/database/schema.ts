import type { Routes } from "@seamapi/fake-seam-connect"
import type { HoistedStoreApi } from "zustand-hoist"

import type {
  AccessCode,
  AccessToken,
  AcsAccessGroup,
  AcsUser,
  ActionAttempt,
  ApiKey,
  Bridge,
  BridgeClientSession,
  ClientSession,
  ConnectedAccount,
  ConnectWebview,
  Device,
  Event,
  NoiseThreshold,
  PhoneInvitation,
  PhoneSdkInstallation,
  UserSession,
  UserWorkspace,
  Workspace,
} from "lib/zod/index.ts"

import type { RecursivePartial } from "lib/util/type-helpers.ts"
import type { AcsEntrance } from "lib/zod/acs/entrance.ts"
import type { AcsSystem } from "lib/zod/acs/system.ts"
import type {
  AssaAbloyCard,
  CredentialService,
  SimulatedEvent,
} from "lib/zod/assa_abloy_credential_service.ts"
import type { Endpoint } from "lib/zod/endpoints.ts"
import type { EnrollmentAutomation } from "lib/zod/enrollment_automation.ts"
import type { UserIdentity } from "lib/zod/user_identity.ts"
import type { Webhook } from "lib/zod/webhook.ts"

export type WorkspaceId = string

export interface DatabaseState {
  _counters: Record<string, number>
  devicedbConfig: DevicedbConfig | null
  workspaces: Workspace[]
  api_keys: ApiKey[]
  access_codes: AccessCode[]
  access_tokens: AccessToken[]
  assa_abloy_credential_services: CredentialService[]
  assa_abloy_cards: AssaAbloyCard[]
  endpoints: Endpoint[]
  enrollment_automations: EnrollmentAutomation[]
  connect_webviews: ConnectWebview[]
  client_sessions: ClientSession[]
  bridge_client_sessions: BridgeClientSession[]
  bridges: Bridge[]
  connected_accounts: ConnectedAccount[]
  devices: Device[]
  events: Event[]
  action_attempts: ActionAttempt[]
  noise_thresholds: NoiseThreshold[]
  simulatedWorkspaceOutages: Record<
    string,
    { workspace_id: string; routes: Array<keyof Routes> } | undefined
  >
  simulatedEvents: Record<string, SimulatedEvent[]>
  phone_invitations: PhoneInvitation[]
  phone_sdk_installations: PhoneSdkInstallation[]
  user_identities: UserIdentity[]
  user_sessions: UserSession[]
  user_workspaces: UserWorkspace[]
  acs_systems: AcsSystem[]
  acs_users: AcsUser[]
  acs_access_groups: AcsAccessGroup[]
  acs_entrances: AcsEntrance[]
  webhooks: Webhook[]
}

export interface DatabaseMethods {
  _getNextId: (type: string) => string
  getNextRequestId: () => string
  setDevicedbConfig: (devicedbConfig: DevicedbConfig) => void
  _addAssaAbloyCredentialService: (params: {
    workspace_id: string
  }) => CredentialService
  addWorkspace: (params: {
    name: string
    publishable_key?: string
    created_at?: string
    workspace_id?: string
    is_sandbox?: boolean
    is_suspended?: boolean
    connect_partner_name?: string
    company_name?: string
    connect_webview_customization?: Workspace["connect_webview_customization"]
  }) => Workspace
  resetSandboxWorkspace: (workspace_id: string) => void
  addApiKey: (params: {
    name?: string
    token?: string
    created_at?: string
    workspace_id: string
  }) => ApiKey
  addAccessToken: (params: {
    access_token_name: string
    email: string
    short_token: string
    long_token_hash: string
    user_id?: string
    created_at?: string
  }) => AccessToken
  addClientSession: (
    params: Pick<ClientSession, "workspace_id"> & Partial<ClientSession>,
  ) => ClientSession
  addBridgeClientSession: (
    params: Partial<BridgeClientSession>,
  ) => BridgeClientSession
  updateBridgeClientSession: (params: {
    bridge_client_session_id: string
    pairing_code?: string
    pairing_code_expires_at?: string
    _last_status_report_received_at?: string
  }) => void
  addBridge: (
    params: Pick<Bridge, "workspace_id" | "bridge_client_session_id">,
  ) => Bridge
  addUserIdentity: (params: {
    workspace_id: WorkspaceId
    user_identity_id?: string
    user_identity_key?: string
    email_address?: string
    created_at?: string
    phone_number?: string
    full_name?: string
  }) => UserIdentity
  addEndpoint: (params: {
    assa_abloy_credential_service_id: string
    invitation_id: string
  }) => Endpoint
  activateEndpoint: (params: {
    endpoint_id: string
    invitation_code: string
  }) => void
  addAssaAbloyCard: (params: { endpoint_id: string }) => AssaAbloyCard
  addSimulatedReaderEvent: (
    event: Omit<SimulatedEvent, "timestamp">,
  ) => SimulatedEvent
  addEnrollmentAutomation: (params: {
    enrollment_automation_id?: string
    workspace_id: WorkspaceId
    user_identity_id: string
    assa_abloy_credential_service_id: string
  }) => EnrollmentAutomation
  updateClientSession: (params: {
    client_session_id: string
    connected_account_ids?: string[]
    connect_webview_ids?: string[]
  }) => void
  getClientSession: (token: string) => ClientSession | undefined

  addConnectWebview: (
    params: Partial<ConnectWebview> & Pick<ConnectWebview, "workspace_id">,
  ) => ConnectWebview
  updateConnectWebview: (params: {
    connect_webview_id: string
    connected_account_id: string
    status: "pending" | "authorized" | "failed"
  }) => void

  addConnectedAccount: (params: {
    provider: string
    workspace_id: string
    user_identifier: ConnectedAccount["user_identifier"]
    connected_account_id?: string
    created_at?: string
    account_type?: string
    automatically_manage_new_devices?: boolean
    custom_metadata?: ConnectedAccount["custom_metadata"]
    accepted_capabilities?: string[]
    bridge_id?: string
  }) => ConnectedAccount
  updateConnectedAccount: (params: {
    connected_account_id: string
    automatically_manage_new_devices?: boolean
    custom_metadata?: ConnectedAccount["custom_metadata"]
  }) => ConnectedAccount
  deleteConnectedAccount: (
    params: Pick<ConnectedAccount, "connected_account_id">,
  ) => void
  addDevice: (params: {
    device_id?: string
    device_type: Device["device_type"]
    display_name?: string
    connected_account_id?: string
    workspace_id: string
    name: string
    properties?: Partial<Device["properties"]>
    can_remotely_lock?: boolean
    can_remotely_unlock?: boolean
    can_program_online_access_codes?: boolean
    errors?: Device["errors"]
    warnings?: Device["warnings"]
    created_at?: string
    custom_metadata?: Device["custom_metadata"]
    space_ids?: Device["space_ids"]
  }) => Device
  deleteDevice: (device_id: Device["device_id"]) => void
  updateDevice: (
    params: Pick<Device, "device_id"> & RecursivePartial<Device>,
  ) => Device
  addAccessCode: (
    params: {
      workspace_id: string
      name: string
      code: string
      device_id: string
      created_at?: string
    } & Partial<AccessCode>,
  ) => AccessCode
  findAccessCode: (params: {
    access_code_id: string
    device_id?: string
  }) => AccessCode | undefined
  updateAccessCode: (
    params: Pick<AccessCode, "access_code_id"> & Partial<AccessCode>,
  ) => AccessCode
  deleteAccessCode: (access_code_id: AccessCode["access_code_id"]) => void
  setPulledBackupAccessCodeId: (params: {
    original_access_code_id: string
    pulled_backup_access_code_id: string
  }) => void

  addActionAttempt: (params: Partial<ActionAttempt>) => ActionAttempt
  findActionAttempt: (
    params: Pick<ActionAttempt, "action_attempt_id">,
  ) => ActionAttempt | undefined
  updateActionAttempt: (
    params: Partial<ActionAttempt> & Pick<ActionAttempt, "action_attempt_id">,
  ) => ActionAttempt

  simulateWorkspaceOutage: (
    workspace_id: string,
    context: {
      routes: Array<keyof Routes>
    },
  ) => void
  simulateWorkspaceOutageRecovery: (workspace_id: string) => void

  addNoiseThreshold: (
    params: Pick<
      NoiseThreshold,
      "device_id" | "starts_daily_at" | "ends_daily_at"
    > &
      Partial<NoiseThreshold>,
  ) => NoiseThreshold
  deleteNoiseThreshold: (
    params: Pick<NoiseThreshold, "noise_threshold_id" | "device_id">,
  ) => void
  updateNoiseThreshold: (
    params: Pick<NoiseThreshold, "device_id" | "noise_threshold_id"> &
      Partial<NoiseThreshold>,
  ) => NoiseThreshold

  addEvent: (
    params: Partial<Event> & Pick<Event, "event_type" | "workspace_id">,
  ) => Event

  addPhoneSdkInstallation: (
    params: Omit<
      PhoneSdkInstallation,
      "phone_sdk_installation_id" | "user_identity_id" | "device_id"
    > & {
      client_session_id: string
    },
  ) => PhoneSdkInstallation

  getPhoneSdkInstallation: (
    params: Pick<
      PhoneSdkInstallation,
      "workspace_id" | "ext_sdk_installation_id"
    > & { client_session_id: string },
  ) => PhoneSdkInstallation | undefined

  addInvitation: (
    params: Omit<PhoneInvitation, "invitation_id" | "user_identity_id"> & {
      client_session_id: string
    },
  ) => PhoneInvitation

  assignInvitationCode: (params: { invitation_id: string }) => PhoneInvitation

  getInvitationByCode: (params: {
    invitation_code: string
  }) => PhoneInvitation | undefined

  getEnrollmentAutomations: (params: {
    client_session_id: string
  }) => EnrollmentAutomation[]

  getInvitations: (params: {
    phone_sdk_installation_id: string
    client_session_id: string
  }) => PhoneInvitation[]

  getEndpoints: (params: {
    phone_sdk_installation_id: string
    client_session_id: string
  }) => Endpoint[]

  addAcsSystem: (
    params: Pick<
      AcsSystem,
      "external_type" | "name" | "workspace_id" | "connected_account_id"
    > &
      Partial<Pick<AcsSystem, "created_at" | "acs_system_id">>,
  ) => AcsSystem

  addAcsUser: (
    params: Partial<
      Omit<AcsUser, "acs_user_id" | "external_type_display_name">
    > &
      Pick<AcsUser, "external_type" | "acs_system_id" | "workspace_id">,
  ) => AcsUser
  deleteAcsUser: (acs_user_id: AcsUser["acs_user_id"]) => void
  updateAcsUser: (
    params: Pick<AcsUser, "acs_user_id"> & Partial<AcsUser>,
  ) => AcsUser

  addAcsAccessGroup: (
    params: Pick<
      AcsAccessGroup,
      "external_type" | "name" | "workspace_id" | "acs_system_id"
    > &
      Partial<Pick<AcsAccessGroup, "created_at">>,
  ) => AcsAccessGroup
  addAcsUserToAcsAccessGroup: (params: {
    acs_user_id: string
    acs_access_group_id: string
  }) => void
  removeAcsUserFromAcsAccessGroup: (params: {
    acs_user_id: string
    acs_access_group_id: string
  }) => void

  addAcsEntrance: (
    params: Partial<AcsEntrance> & Pick<AcsEntrance, "acs_system_id">,
  ) => AcsEntrance
  grantAcsUserAccessToAcsEntrance: (params: {
    acs_user_id: string
    acs_entrance_id: string
  }) => void

  addUserWorkspace: (
    params: Partial<UserWorkspace> &
      Pick<
        UserWorkspace,
        "workspace_id" | "is_owner" | "user_id" | "user_workspace_id"
      >,
  ) => UserWorkspace

  addUserSession: (
    params: Pick<UserSession, "user_id" | "key"> & Partial<UserSession>,
  ) => UserSession
  addWebhook: (
    params: { workspace_id: string } & Pick<Webhook, "event_types" | "url">,
  ) => Webhook
  deleteWebhook: (webhook_id: string) => void

  update: (t?: number) => void
}

interface DevicedbConfig {
  url: string
  vercelProtectionBypassSecret: string
}

export type Database = DatabaseState & DatabaseMethods

export type ZustandDatabase = HoistedStoreApi<Database>
