var Config =
{
	ms_GameWidth: 0,
	ms_GameHeight: 0,
	ms_MiddleX: 0,
	ms_MiddleY: 0,
	Initialize: function()
	{
		Config.ms_GameWidth = 10;
		Config.ms_GameHeight = 20;
		Config.ms_MiddleX = Config.ms_GameWidth * 0.5;
		Config.ms_MiddleY = Config.ms_GameHeight * 0.5;
	}
};