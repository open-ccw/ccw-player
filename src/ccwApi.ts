import VirtualMachine from "@open-ccw/scratch-vm";

const onlineExtCfg = {
  fileSrc: "",
  hosts: {
    cloudDBHost: "https://community-web-cloud-database.ccw.site",
    mmoHost: "wss://mo.ccw.site",
    gandiMainHost: "https://gandi-main.ccw.site",
    translate: "https://community-web.ccw.site/ccw-main/external/mt/translate/",
    tts: "https://community-web.ccw.site/ccw-main/external/speech/tts/",
  },
  GandiMedia: {
    api: {
      fetchMediaVideoList() {
        throw new Error("Function not implemented.");
      },
      fetchMediaAudioList() {
        throw new Error("Function not implemented.");
      },
    },
  },
  GandiAchievementAndLeaderboard: {
    api: {
      showLeaderboard() {
        throw new Error("Function not implemented.");
      },
      insertLeaderboard() {
        throw new Error("Function not implemented.");
      },
      getUserInfoFromLeaderboard() {
        throw new Error("Function not implemented.");
      },
      getUserRankingInLeaderboard() {
        throw new Error("Function not implemented.");
      },
      showAchievementList() {
        throw new Error("Function not implemented.");
      },
      obtainAchievement() {
        throw new Error("Function not implemented.");
      },
      hasAchievement() {
        throw new Error("Function not implemented.");
      },
      hasAchievementByTemplateId() {
        throw new Error("Function not implemented.");
      },
      getAchieveList() {
        throw new Error("Function not implemented.");
      },
      updateAchievementExtra() {
        throw new Error("Function not implemented.");
      },
      getLeaderboardList() {
        throw new Error("Function not implemented.");
      },
    },
  },
  GandiAsyncAssetManager: {
    api: {
      requestSaveAndUploadSnapshot() {
        throw new Error("Function not implemented.");
      },
    },
  },
  GandiEconomy: {
    api: {
      requestExecuteSmartContract() {
        throw new Error("Function not implemented.");
      },
      getSmartContractList() {
        throw new Error("Function not implemented.");
      },
      createContractList() {
        throw new Error("Function not implemented.");
      },
      getSmartContractEarningByContractId() {
        throw new Error("Function not implemented.");
      },
      getSmartContractAccountByContractId() {
        throw new Error("Function not implemented.");
      },
      showSmartContractDetail() {
        throw new Error("Function not implemented.");
      },
      showSmartContractInjectionModal() {
        throw new Error("Function not implemented.");
      },
    },
  },
};

export function ccwApi({
  vm,
  projectOid,
}: {
  vm: VirtualMachine;
  projectOid: string;
}) {
  return {
    getCoinCount(): Promise<number> {
      throw new Error("Function not implemented.");
    },
    getOpenVM(): Partial<VirtualMachine> {
      return { runtime: vm.runtime };
    },
    getOnlineExtensionsConfig(): any {
      return onlineExtCfg;
    },
    getExtensionURLById(id: string): Promise<string> {
      throw new Error("Function not implemented.");
    },
    commentWithStageSnapshot(): Promise<any> {
      throw new Error("Function not implemented.");
    },
    getDeviceType(): Promise<"PC"> {
      return Promise.resolve("PC");
    },
    getProjectDonateRanking(): void {
      throw new Error("Function not implemented.");
    },
    getProjectSb3Id(): string {
      throw new Error("Function not implemented.");
    },
    getProjectStats(): Promise<any> {
      throw new Error("Function not implemented.");
    },
    getProjectUUID(): string {
      return projectOid;
    },
    async getUserInfo(): Promise<any> {
      return Promise.resolve();
    },
    isFavoriteProject(): void {
      throw new Error("Function not implemented.");
    },
    isFollowed(): Promise<boolean> {
      throw new Error("Function not implemented.");
    },
    isLiked(): Promise<boolean> {
      throw new Error("Function not implemented.");
    },
    isLikedProject(): Promise<boolean> {
      throw new Error("Function not implemented.");
    },
    isMyFans(): Promise<boolean> {
      throw new Error("Function not implemented.");
    },
    preActionInterceptor(): void {
      throw new Error("Function not implemented.");
    },
    redirect(): void {
      throw new Error("Function not implemented.");
    },
    requestCoins(): void {
      throw new Error("Function not implemented.");
    },
    requestFollow(): void {
      throw new Error("Function not implemented.");
    },
    sendPlayEventCode(): void {
      throw new Error("Function not implemented.");
    },
    setAvatar(): void {
      throw new Error("Function not implemented.");
    },
    showShare(): void {
      throw new Error("Function not implemented.");
    },
    uploadAssetToCloud(): void {
      throw new Error("Function not implemented.");
    },
  };
}
