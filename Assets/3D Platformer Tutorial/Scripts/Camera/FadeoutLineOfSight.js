/* Fades out any objects between the player and this transform.
   The renderers shader is first changed to be an Alpha/Diffuse, then alpha is faded out to fadedOutAlpha.
   Only objects 
   
   In order to catch all occluders, 5 rays are casted. occlusionRadius is the distance between them.
*/
var layerMask : LayerMask = 2;
var target : Transform;
var fadeSpeed = 1.0;
var occlusionRadius = .3;
var fadedOutAlpha = 0.3;

private var fadedOutObjects = Array ();

class FadeoutLOSInfo
{
	var renderer : Renderer;
	var originalMaterials : Material[];
	var alphaMaterials : Material[];
	var needFadeOut = true;
}

function FindLosInfo (r : Renderer) : FadeoutLOSInfo
{
	for (var fade : FadeoutLOSInfo in fadedOutObjects)
	{
		if (r == fade.renderer)
			return fade;
	}
	return null;
}

function LateUpdate () {
	var from = transform.position;
	var to = target.position;
	var castDistance = Vector3.Distance(to, from);
	
	// Mark all objects as not needing fade out
	for (var fade : FadeoutLOSInfo in fadedOutObjects)
	{
		fade.needFadeOut = false;
	}
	
	var offsets = [Vector3(0, 0, 0), Vector3(0, occlusionRadius, 0), Vector3(0, -occlusionRadius, 0), Vector3(occlusionRadius, 0, 0), Vector3(-occlusionRadius, 0, 0)];
	
	// We cast 5 rays to really make sure even occluders that are partly occluding the player are faded out
	for (var offset in offsets)
	{
		var relativeOffset = transform.TransformDirection(offset);
		// Find all blocking objects which we want to hide
		var hits : RaycastHit[] = Physics.RaycastAll(from + relativeOffset, to - from, castDistance, layerMask.value);
		for (var hit : RaycastHit in hits)
		{
			// Make sure we have a renderer
			var hitRenderer : Renderer = hit.collider.renderer;		
			if (hitRenderer == null || !hitRenderer.enabled)
				continue;
			
			var info = FindLosInfo(hitRenderer);
	
			// We are not fading this renderer already, so insert into faded objects map
			if (info == null)
			{
				info = new FadeoutLOSInfo ();
				info.originalMaterials = hitRenderer.sharedMaterials;
				info.alphaMaterials = new Material[info.originalMaterials.length];
				info.renderer = hitRenderer;
				for (var i=0;i<info.originalMaterials.length;i++)
				{
					var newMaterial = new Material (Shader.Find("Alpha/Diffuse"));
					newMaterial.mainTexture = info.originalMaterials[i].mainTexture;	
					newMaterial.color = info.originalMaterials[i].color;
					newMaterial.color.a = 1.0;
					info.alphaMaterials[i] = newMaterial;
				}
				
				hitRenderer.sharedMaterials = info.alphaMaterials;
				fadedOutObjects.Add(info);
			}
			// Just mark the renderer as needing fade out
			else
			{
				info.needFadeOut = true;
			}
		}
	}
		
	// Now go over all renderers and do the actual fading!
	var fadeDelta = fadeSpeed * Time.deltaTime;
	for (i=0;i<fadedOutObjects.Count;i++)
	{
		var fade = fadedOutObjects[i];
		// Fade out up to minimum alpha value
		if (fade.needFadeOut)
		{
			for (var alphaMaterial : Material in fade.alphaMaterials)
			{
				var alpha = alphaMaterial.color.a;
				alpha -= fadeDelta;
				alpha = Mathf.Max(alpha, fadedOutAlpha);
				alphaMaterial.color.a = alpha;
			}
		}
		// Fade back in
		else
		{
			var totallyFadedIn = 0;
			for (var alphaMaterial : Material in fade.alphaMaterials)
			{
				alpha = alphaMaterial.color.a;
				alpha += fadeDelta;
				alpha = Mathf.Min(alpha, 1.0);
				alphaMaterial.color.a = alpha;
				if (alpha >= 0.99)
					totallyFadedIn++;
			}
			
			// All alpha materials are faded back to 100%
			// Thus we can switch back to the original materials
			if (totallyFadedIn == fade.alphaMaterials.length)
			{
				if (fade.renderer)
					fade.renderer.sharedMaterials = fade.originalMaterials;
					
				for (var newerMaterial in fade.alphaMaterials)
					Destroy(newerMaterial);
				
				fadedOutObjects.RemoveAt(i);
				i--;
			}
		}
	}
}

@script AddComponentMenu ("Third Person Camera/Fadeout Line of Sight")