package com.easterndestiny.widget

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.widget.RemoteViews
import com.pagodaonline.R
import org.json.JSONObject

class DailyBriefWidgetProvider : AppWidgetProvider() {

  override fun onUpdate(
    context: Context,
    appWidgetManager: AppWidgetManager,
    appWidgetIds: IntArray,
  ) {
    appWidgetIds.forEach { id ->
      updateWidget(
        context,
        appWidgetManager,
        id,
      )
    }
  }

  companion object {
    const val PREFERENCES_NAME =
      "eastern_destiny_widget"

    const val DATA_KEY =
      "daily_brief_json"

    private const val FALLBACK_TITLE =
      "Eastern Destiny"

    private const val FALLBACK_HEADLINE =
      "Open the app to refresh your Daily Brief."

    fun updateWidget(
      context: Context,
      manager: AppWidgetManager,
      widgetId: Int,
    ) {
      val preferences =
        context.getSharedPreferences(
          PREFERENCES_NAME,
          Context.MODE_PRIVATE,
        )

      val raw =
        preferences.getString(
          DATA_KEY,
          null,
        )

      val data =
        parseData(raw)

      val views =
        RemoteViews(
          context.packageName,
          R.layout.eastern_destiny_widget,
        )

      views.setTextViewText(
        R.id.widget_title,
        data.title,
      )

      views.setTextViewText(
        R.id.widget_date,
        data.date,
      )

      views.setTextViewText(
        R.id.widget_lunar,
        data.lunarDate,
      )

      views.setTextViewText(
        R.id.widget_headline,
        data.headline,
      )

      views.setTextViewText(
        R.id.widget_profile,
        data.profileName,
      )

      views.setTextViewText(
        R.id.widget_can_chi,
        data.dayCanChi,
      )

      val launchIntent =
        context.packageManager
          .getLaunchIntentForPackage(
            context.packageName,
          )
          ?: Intent()

      launchIntent.flags =
        Intent.FLAG_ACTIVITY_NEW_TASK or
          Intent.FLAG_ACTIVITY_CLEAR_TOP

      launchIntent.putExtra(
        "easternDestinyRoute",
        "DailyBrief",
      )

      launchIntent.putExtra(
        "profileId",
        data.profileId,
      )

      val pendingIntent =
        PendingIntent.getActivity(
          context,
          widgetId,
          launchIntent,
          PendingIntent.FLAG_UPDATE_CURRENT or
            PendingIntent.FLAG_IMMUTABLE,
        )

      views.setOnClickPendingIntent(
        R.id.widget_root,
        pendingIntent,
      )

      manager.updateAppWidget(
        widgetId,
        views,
      )
    }

    private fun parseData(
      raw: String?,
    ): WidgetData {
      if (raw.isNullOrBlank()) {
        return WidgetData(
          title =
            FALLBACK_TITLE,
          date = "",
          lunarDate = "",
          headline =
            FALLBACK_HEADLINE,
          profileName = "",
          dayCanChi = "",
          profileId = "",
        )
      }

      return try {
        val json =
          JSONObject(raw)

        WidgetData(
          title =
            json.optString(
              "title",
              FALLBACK_TITLE,
            ),
          date =
            json.optString(
              "date",
              "",
            ),
          lunarDate =
            json.optString(
              "lunarDate",
              "",
            ),
          headline =
            json.optString(
              "headline",
              FALLBACK_HEADLINE,
            ),
          profileName =
            json.optString(
              "profileName",
              "",
            ),
          dayCanChi =
            json.optString(
              "dayCanChi",
              "",
            ),
          profileId =
            json.optString(
              "profileId",
              "",
            ),
        )
      } catch (
        error: Exception,
      ) {
        WidgetData(
          title =
            FALLBACK_TITLE,
          date = "",
          lunarDate = "",
          headline =
            FALLBACK_HEADLINE,
          profileName = "",
          dayCanChi = "",
          profileId = "",
        )
      }
    }
  }
}

private data class WidgetData(
  val title: String,
  val date: String,
  val lunarDate: String,
  val headline: String,
  val profileName: String,
  val dayCanChi: String,
  val profileId: String,
)
