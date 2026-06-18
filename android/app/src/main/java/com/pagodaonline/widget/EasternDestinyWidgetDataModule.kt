package com.easterndestiny.widget

import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Context
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class EasternDestinyWidgetDataModule(
  private val reactContext: ReactApplicationContext,
) : ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String =
    "EasternDestinyWidgetData"

  @ReactMethod
  fun setWidgetData(
    json: String,
    promise: Promise,
  ) {
    try {
      val preferences =
        reactContext.getSharedPreferences(
          DailyBriefWidgetProvider.PREFERENCES_NAME,
          Context.MODE_PRIVATE,
        )

      preferences
        .edit()
        .putString(
          DailyBriefWidgetProvider.DATA_KEY,
          json,
        )
        .apply()

      updateWidgets()
      promise.resolve(null)
    } catch (error: Exception) {
      promise.reject(
        "WIDGET_WRITE_FAILED",
        error,
      )
    }
  }

  @ReactMethod
  fun reloadWidget(
    promise: Promise,
  ) {
    try {
      updateWidgets()
      promise.resolve(null)
    } catch (error: Exception) {
      promise.reject(
        "WIDGET_RELOAD_FAILED",
        error,
      )
    }
  }

  private fun updateWidgets() {
    val manager =
      AppWidgetManager.getInstance(
        reactContext,
      )

    val component =
      ComponentName(
        reactContext,
        DailyBriefWidgetProvider::class.java,
      )

    val ids =
      manager.getAppWidgetIds(
        component,
      )

    ids.forEach { id ->
      DailyBriefWidgetProvider.updateWidget(
        reactContext,
        manager,
        id,
      )
    }
  }
}
